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
	CREATE TYPE discord.accessMethod AS ENUM ('everyone', 'role', 'channel', 'server', 'dm');
EXCEPTION
	WHEN duplicate_object THEN null;
END $$;

-- Create the tables.
CREATE TABLE IF NOT EXISTS discord.Settings (
	Namespace varchar(32)
		CONSTRAINT Settings_Namespace_PK PRIMARY KEY
		CONSTRAINT Settings_Namespace_C CHECK (Namespace SIMILAR TO '[a-zA-Z]'),
	Value jsonb
		CONSTRAINT Settings_Value_NN NOT NULL
		CONSTRAINT Settings_Value_C CHECK (pg_column_size(Value) <= 128160)
);

CREATE TABLE IF NOT EXISTS discord.User_Settings (
	User_Id bigint,
	Value jsonb
		CONSTRAINT User_Settings_Value_NN NOT NULL
		CONSTRAINT User_Settings_Value_C CHECK (pg_column_size(Value) <= 128160),
	Namespace varchar(32),
	CONSTRAINT User_Settings_PK PRIMARY KEY (User_Id, Namespace),
	CONSTRAINT User_Settings_FK FOREIGN KEY (Namespace) REFERENCES discord.Settings(Namespace)
);

CREATE TABLE IF NOT EXISTS discord.Bots (
	Bot_Id bigint
		CONSTRAINT Bots_PK PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS discord.Restrictions (
	Restriction_Type discord.accessType,
	Restriction_Method discord.accessMethod,
	Ids bigint[]
		CONSTRAINT Restrictions_Ids_NN NOT NULL
		CONSTRAINT Restrictions_Ids_C CHECK (array_length(Ids, 1) <= 1000),
	Command_Id varchar(32),
	CONSTRAINT Restrictions_PK PRIMARY KEY (Restriction_Type, Restriction_Method, Command_Id)
);

CREATE TABLE IF NOT EXISTS discord.Commands (
	Command_Id varchar(32),
	Bot_Id bigint
		CONSTRAINT Commands_Bot_Id_NN NOT NULL
		CONSTRAINT Commands_Bot_Id_FK REFERENCES discord.Bots(Bot_Id),
	Server_Id bigint,
    Restriction_Type discord.accessType,
    Restriction_Method discord.accessMethod,
	CONSTRAINT Commands_PK PRIMARY KEY (Command_Id, Server_Id),
	CONSTRAINT Commands_Command_Id_C CHECK (Command_Id SIMILAR TO '[a-zA-Z]'),
    CONSTRAINT Commands_Restriction_FK FOREIGN KEY (Command_Id, Restriction_Type, Restriction_Method) REFERENCES discord.Restrictions(Command_Id, Restriction_Type, Restriction_Method)
);

CREATE TABLE IF NOT EXISTS discord.Servers (
	Server_Id bigint
		CONSTRAINT Servers_Server_Id_PK PRIMARY KEY,
	Prefix varchar(32) DEFAULT '/'
		CONSTRAINT Servers_Prefix_NN NOT NULL,
    Command_Id varchar(32)
    	CONSTRAINT Servers_Command_Id_N NULL,
    CONSTRAINT Servers_Command_Id_FK FOREIGN KEY (Server_Id, Command_Id) REFERENCES discord.Commands(Server_Id, Command_Id)
);

CREATE TABLE IF NOT EXISTS discord.ServerBots (
	Server_Id bigint,
    Bot_Id bigint,
    CONSTRAINT ServerBots_PK PRIMARY KEY (Server_Id, Bot_Id),
    CONSTRAINT ServerBots_Server_Id_FK FOREIGN KEY (Server_Id) REFERENCES discord.Servers(Server_Id),
    CONSTRAINT ServerBots_Bot_Id_FK FOREIGN KEY (Bot_Id) REFERENCES discord.Bots(Bot_Id)
);

CREATE TABLE IF NOT EXISTS discord.Triggers (
	Trigger_Id varchar(32),
	Event_Id varchar(32)
		CONSTRAINT Triggers_EVENT_Id_NN NOT NULL
		CONSTRAINT Triggers_Event_Id_C CHECK (Event_Id SIMILAR TO '[a-zA-Z]'),
	Event_Parameters varchar(1024)
		CONSTRAINT Triggers_Event_Parameters_N NULL,
	Response_Id varchar(32)
		CONSTRAINT Triggers_Response_Id_NN NOT NULL
		CONSTRAINT Triggers_Response_Id_C CHECK (Response_Id SIMILAR TO '[a-zA-Z]'),
	Response_Parameters varchar(1024)
		CONSTRAINT Triggers_Response_Parameters_N NULL,
	Server_Id bigint,
	CONSTRAINT Triggers_PK PRIMARY KEY (Trigger_Id, Server_Id),
	CONSTRAINT Triggers_Trigger_Id_C CHECK (Trigger_Id SIMILAR TO '[a-zA-Z]'),
	CONSTRAINT Triggers_Server_Id_FK FOREIGN KEY (Server_Id) REFERENCES discord.Servers(Server_Id)
);

-- Adds initial bot records.
CREATE OR REPLACE FUNCTION discord.AddBot(P_Bot_Id bigint, P_Server_Id bigint) RETURNS void AS $$
BEGIN
	INSERT INTO discord.Bots(Bot_Id)
		VALUES(P_Bot_Id)
	ON CONFLICT ON CONSTRAINT Bots_PK DO NOTHING;
    INSERT INTO discord.Servers(Server_Id)
		VALUES(P_Server_Id)
	ON CONFLICT ON CONSTRAINT Servers_Server_Id_PK DO NOTHING;
    INSERT INTO discord.ServerBots(Server_Id, Bot_Id)
		VALUES(P_Server_Id, P_Bot_Id)
	ON CONFLICT ON CONSTRAINT ServerBots_PK DO NOTHING;
END;
$$ LANGUAGE plpgsql;
