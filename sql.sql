-- Drop everything related to the server.
DROP SCHEMA IF EXISTS discord CASCADE;


-- Create the Discord schema.
CREATE SCHEMA IF NOT EXISTS discord;

-- Create enums.
/*
allow - Only allow the types specified.
deny - Do not allow the types specified.
*/
DO $$ BEGIN
	CREATE TYPE discord.accessType AS ENUM ('allow', 'deny');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;
/*
everyone - Applies the method to everyone.
role - Checks the users roles.
channel - Checks the channel that the command was used in.
server - Checks the server that the command was used in.
dm - Checks if the command is being called from a direct message.
*/
DO $$ BEGIN
	CREATE TYPE discord.accessMethod AS ENUM ('dm', 'server', 'everyone', 'channel', 'role');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Create the tables.
CREATE TABLE IF NOT EXISTS discord.Settings (
	Namespace varchar(32)
		CONSTRAINT Settings_Namespace_NN NOT NULL
		CONSTRAINT Settings_Namespace_C CHECK (Namespace SIMILAR TO '[a-zA-Z]+'),
	Server_Id bigint,
	Value jsonb
		CONSTRAINT Settings_Value_NN NOT NULL
		CONSTRAINT Settings_Value_C CHECK (pg_column_size(Value) <= 128160),
	CONSTRAINT Settings_UN UNIQUE (Namespace, Server_Id)
);

CREATE TABLE IF NOT EXISTS discord.User_Settings (
	Namespace varchar(32),
	User_Id bigint,
    Server_Id bigint
    	CONSTRAINT User_Settings_Server_Id_N NULL,
    Value jsonb
		CONSTRAINT User_Settings_Value_NN NOT NULL
		CONSTRAINT User_Settings_Value_C CHECK (pg_column_size(Value) <= 128160),
    CONSTRAINT User_Settings_Namepsace_FK FOREIGN KEY (Namespace, Server_Id) REFERENCES discord.Settings(Namespace, Server_Id),
	CONSTRAINT User_Settings_PK PRIMARY KEY (User_Id, Namespace)
);

CREATE TABLE IF NOT EXISTS discord.Triggers (
	Trigger_Id varchar(32)
    	CONSTRAINT Triggers_Trigger_Id_C CHECK (Trigger_Id SIMILAR TO '[a-zA-Z]+'),
	Event_Id varchar(32)
		CONSTRAINT Triggers_EVENT_Id_NN NOT NULL
		CONSTRAINT Triggers_Event_Id_C CHECK (Event_Id SIMILAR TO '[a-zA-Z]+'),
	Event_Parameters varchar(1024)
		CONSTRAINT Triggers_Event_Parameters_N NULL,
	Response_Id varchar(32)
		CONSTRAINT Triggers_Response_Id_NN NOT NULL
		CONSTRAINT Triggers_Response_Id_C CHECK (Response_Id SIMILAR TO '[a-zA-Z]+'),
	Response_Parameters varchar(1024)
		CONSTRAINT Triggers_Response_Parameters_N NULL,
	Server_Id bigint,
	CONSTRAINT Triggers_PK PRIMARY KEY (Trigger_Id, Server_Id)
);

CREATE TABLE IF NOT EXISTS discord.Servers (
	Server_Id bigint
		CONSTRAINT Servers_Server_Id_PK PRIMARY KEY,
	Prefix varchar(32) DEFAULT '/'
		CONSTRAINT Servers_Prefix_NN NOT NULL,
    Trigger_Id varchar(32)
    	CONSTRAINT Servers_Trigger_Id_N NULL,
    Namespace varchar(32)
    	CONSTRAINT Servers_Namespace_N NULL,
    Command_Id varchar(32)
    	CONSTRAINT Servers_Command_Id_N NULL,
    CONSTRAINT Servers_Triggers_FK FOREIGN KEY (Trigger_Id, Server_Id) REFERENCES discord.Triggers(Trigger_Id, Server_Id),
    CONSTRAINT Servers_Settings_FK FOREIGN KEY (Server_Id, Namespace) REFERENCES discord.Settings(Server_Id, Namespace)
);

CREATE TABLE IF NOT EXISTS discord.Restrictions (
	Restriction_Type discord.accessType,
	Restriction_Method discord.accessMethod,
	Ids bigint[]
		CONSTRAINT Restrictions_Ids_NN NOT NULL
		CONSTRAINT Restrictions_Ids_C CHECK (array_length(Ids, 1) <= 1000),
	Command_Id varchar(32),
    Server_Id bigint,
	CONSTRAINT Restrictions_PK PRIMARY KEY (Restriction_Type, Restriction_Method, Command_Id)
);

CREATE TABLE IF NOT EXISTS discord.Commands (
	Command_Id varchar(32)
    	CONSTRAINT Commands_Command_Id_PK PRIMARY KEY
    	CONSTRAINT Commands_Command_Id_C CHECK (Command_Id SIMILAR TO '[a-zA-Z]+'),
    Restriction_Type discord.accessType
    	CONSTRAINT Commands_Restriction_Type_NN NOT NULL,
    Restriction_Method discord.accessMethod
    	CONSTRAINT Commands_Restriction_Method_NN NOT NULL,
    Server_Id bigint
    	CONSTRAINT Commands_Servers_FK REFERENCES discord.Servers(Server_Id)
    	CONSTRAINT Commands_Server_Id_N NULL,
    CONSTRAINT Commands_Restrictions_FK FOREIGN KEY (Command_Id, Restriction_Type, Restriction_Method) REFERENCES discord.Restrictions(Command_Id, Restriction_Type, Restriction_Method)
);

DO $$ BEGIN
	ALTER TABLE discord.Restrictions
		ADD CONSTRAINT Restrictions_Servers_FK FOREIGN KEY (Server_Id) REFERENCES discord.Servers(Server_Id);
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Adds initial server records.
CREATE OR REPLACE FUNCTION discord.AddBot(P_Server_Id bigint) RETURNS void AS $$
BEGIN
    INSERT INTO discord.Servers(Server_Id)
		VALUES(P_Server_Id)
	ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Check if the command can be invoked by going through each applicable restriction.
CREATE OR REPLACE FUNCTION discord.HasAccess(command varchar, author bigint,
	serverId bigint DEFAULT null, channelId bigint DEFAULT null, roleId bigint DEFAULT null) RETURNS boolean AS $$
DECLARE
	result boolean;
    rValue record;
	rValues cursor(rType discord.accessType) FOR SELECT Restriction_Method RMethod, Ids
		FROM Restrictions
		WHERE Command_Id = commandId and
			(Server_Id is not distinct from null or serverId is not distinct from null or Server_Id = serverId) and
			Restriction_Type = rType
		ORDER BY Restriction_Method;
BEGIN
	OPEN rValues(discord.accessType.allow);
	LOOP
		FETCH rValues INTO rValue;
		EXIT WHEN NOT FOUND;
		
		-- Check if allowed. - 'dm', 'server', 'everyone', 'channel', 'role'
		IF rValue.RMethod = discord.accessMethod.dm THEN
			result := serverId is not distinct from null;
		ELSIF rValue.RMethod = discord.accessMethod.server THEN
			result := serverId = ANY(rValue.Ids);
		ELSIF rValue.RMethod = discord.accessMethod.everyone THEN
			result := true;
		ELSIF rValue.RMethod = discord.accessMethod.channel THEN
			result := channelId = ANY(rValue.Ids);
		ELSIF rValue.RMethod = discord.accessMethod.role THEN
			result := roleId = ANY(rValue.Ids);
		ELSE
			RAISE WARNING 'discord.HasAccess has no implementation for allowing %.', rValue.RMethod USING
				HINT = 'Try replacing the discord.HasAccess function.';
		END IF;
		
		EXIT WHEN result = true;
	END LOOP;
	CLOSE rValues;
	IF result = true THEN
		OPEN rValues(discord.accessType.deny);
		LOOP
			FETCH rValues INTO rValue;
			EXIT WHEN NOT FOUND;
			
			IF rValue.RMethod = discord.accessMethod.dm THEN
				result := serverId is distinct from null;
			ELSIF rValue.RMethod = discord.accessMethod.server THEN
				result := serverId != ALL(rValue.Ids);
			ELSIF rValue.RMethod = discord.accessMethod.everyone THEN
				result := false;
			ELSIF rValue.RMethod = discord.accessMethod.channel THEN
				result := channelId != ALL(rValue.Ids);
			ELSIF rValue.RMethod = discord.accessMethod.role THEN
				result := roleId != ALL(rValue.Ids);
			ELSE
				RAISE WARNING 'discord.HasAccess has no implementation for denying %.', rValues.Method USING
					HINT = 'Try replacing the discord.HasAccess function.';
			END IF;
			
			EXIT WHEN result = false;
		END LOOP;
		CLOSE rValues;
	END IF;
	IF result is not distinct from null THEN
		result := false;
	END IF;
	RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION discord.GetSettings(namespace varchar, serverId bigint DEFAULT null, userId bigint DEFAULT null) RETURNS jsonb AS $$
DECLARE
	result jsonb;
BEGIN
	IF userId = null THEN
		result = (SELECT Value
			FROM discord.Settings Settings
			WHERE Settings.Namespace = namespace AND Server_Id is not distinct from serverId);
	ELSE
		result = (SELECT Value
			FROM discord.User_Settings Settings
			WHERE Settings.Namespace = namespace AND User_Id = userId AND
				Server_Id is not distinct from serverId);
	END IF;
	RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION discord.SetSettings(value jsonb, namespace varchar, serverId bigint, userId bigint DEFAULT null) RETURNS void AS $$
BEGIN
	IF userId is not distinct from null THEN
		INSERT INTO discord.Settings (Namespace, Server_Id, Value)
			VALUES(namespace, serverId, value)
    		ON CONFLICT ON CONSTRAINT Settings_UN
    			DO UPDATE SET discord.Settings.Value = value;
	ELSE
		INSERT INTO discord.Settings (Namespace, Server_Id, Value)
			VALUES(namespace, serverId, 'null')
    		ON CONFLICT ON CONSTRAINT Settings_UN
    			DO NOTHING;
    	INSERT INTO discord.User_Settings (Namespace, Server_Id, User_Id, Value)
			VALUES(namespace, serverId, userId, value);
	END IF;
END;
$$ LANGUAGE plpgsql;
