-- Create enums.
/*
allow - Only allow the types specified.
deny - Do not allow the types specified.
*/
CREATE TYPE accessType AS ENUM ("allow", "deny");
/*
everyone - Applies the method to everyone.
role - Checks the users roles.
channel - Checks the channel that the command was used in.
server - Checks the server that the command was used in.
dm - Checks if the command is being called from a direct message.
*/
CREATE TYPE accessMethod AS ENUM ("everyone", "role", "channel", "server", "dm");

-- Create the tables.
CREATE TABLE IF NOT EXISTS Settings (
	Namespace varchar(32)
		CONSTRAINT Settings_Namespace_PK PRIMARY KEY
		CONSTRAINT Settings_Namespace_C CHECK (Namespace SIMILAR TO "[a-zA-Z]"),
	Value jsonb
		CONSTRAINT Settings_Value_NN NOT NULL
		CONSTRAINT Settings_Value_C CHECK (pg_column_size(Value) <= 128160)
);

CREATE TABLE IF NOT EXISTS User_Settings (
	User_Id bigint,
	Value jsonb
		CONSTRAINT User_Settings_Value_NN NOT NULL
		CONSTRAINT User_Settings_Value_C CHECK (pg_column_size(Value) <= 128160),
	Namespace varchar(32),
	CONSTRAINT User_Settings_PK PRIMARY KEY (User_Id, Namespace)
	CONSTRAINT User_Settings_FK FOREIGN KEY (Namespace) REFERENCES Settings(Namespace)
);

CREATE TABLE IF NOT EXISTS Servers (
	Server_Id bigint
		CONSTRAINT Servers_Server_Id_PK PRIMARY KEY,
	Bot_Id bigint
		CONSTRAINT Server_Bot_Id_FK REFERENCES Bots(Bot_Id),
	Prefix varchar(32) DEFAULT "/"
);

CREATE TABLE IF NOT EXISTS Bots (
	Bot_Id bigint,
	Server_Id bigint
		CONSTRAINT Bots_Bot_Id_FK REFERENCES Servers(Server_Id),
	CONSTRAINT Bots_PK PRIMARY KEY (Bot_Id, Server_Id)
);

CREATE TABLE IF NOT EXISTS Triggers (
	Trigger_Id varchar(32),
	Event_Id varchar(32)
		CONSTRAINT Triggers_Event_Id_C CHECK (Event_Id SIMILAR TO "[a-zA-Z]"),
	Event_Parameters varchar(1024),
	Response_Id varchar(32)
		CONSTRAINT Triggers_Response_Id_C CHECK (Response_Id SIMILAR TO "[a-zA-Z]"),
	Response_Parameters varchar(1024),
	Server_Id bigint,
	CONSTRAINT Triggers_PK PRIMARY KEY (Trigger_Id, Server_Id)
	CONSTRAINT Triggers_Trigger_Id_C CHECK (Trigger_Id SIMILAR TO "[a-zA-Z]")
	CONSTRAINT Triggers_Server_Id_C CHECK (Server_Id SIMILAR TO "[a-zA-Z]")
	CONSTRAINT Triggers_Server_Id_FK FOREIGN KEY (Server_Id) REFERENCES Servers(Server_Id)
);

CREATE TABLE IF NOT EXISTS Commands (
	Command_Id varchar(32),
	Bot_Id bigint
		CONSTRAINT Commands_Bot_Id_FK REFERENCES Bots(Bot_Id),
	Server_Id bigint,
	CONSTRAINT Commands_PK PRIMARY KEY (Command_Id, Server_Id)
	CONSTRAINT Commands_Command_Id_C CHECK (Command_Id SIMILAR TO "[a-zA-Z]")
	CONSTRAINT Commands_Server_Id FOREIGN KEY Server_Id REFERENCES Servers(Server_Id)
);

CREATE TABLE IF NOT EXISTS Restrictions (
	Restriction_Type accessType,
	Restriction_Method accessMethod,
	Ids bigint[]
		CONSTRAINT Restrictions_Ids_C CHECK (array_length(Ids, 1) <= 1000),
	Command_Id varchar(32),
	CONSTRAINT Restrictions_PK PRIMARY KEY (Restriction_Type, Restriction_Method, Command_Id)
	CONSTRAINT Restrictions_Command_Id_FK FOREIGN KEY Command_Id REFERENCES Commands(Command_Id)
);

-- Add procedure to add bot and server rows.
-- Add function to get the server prefix.

