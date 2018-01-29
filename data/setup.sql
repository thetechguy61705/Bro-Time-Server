-- Create the tables.
CREATE TABLE IF NOT EXISTS Settings (
	Namespace varchar(32)
		CONSTRAINT Settings_Namespace_PK PRIMARY KEY,
	Value jsonb
)

CREATE TABLE IF NOT EXISTS User_Settings (
	User_Id bigint,
	Value jsonb,
	Namespace varchar(32),
	CONSTRAINT User_Settings_PK PRIMARY KEY (User_Id, Namespace)
)

CREATE TABLE IF NOT EXISTS Servers (
	Server_Id bigint
		CONSTRAINT Servers_Server_Id_PK PRIMARY KEY,
	Bot_Id bigint,
	Prefix varchar(32)
)

CREATE TABLE IF NOT EXISTS Bots (
	Bot_Id bigint,
	Server_Id bigint,
	CONSTRAINT Bots_PK PRIMARY KEY (Bot_Id, Server_Id)
)

CREATE TABLE IF NOT EXISTS Triggers (
	Trigger_Id varchar(32),
	Event_Id varchar(32),
	Event_Parameters varchar(1024),
	Response_Id varchar(32),
	Response_Parametersvarchar(1024),
	Server_Id bigint,
	CONSTRAINT Triggers_PK PRIMARY KEY (Trigger_Id, Server_Id)
)

CREATE TABLE IF NOT EXISTS Commands (
	Command_Id varchar(32),
	Bot_Id bigint,
	Server_Id bigint,
	CONSTRAINT Commands_PK PRIMARY KEY (Command_Id, Server_Id)
)

CREATE TABLE IF NOT EXISTS Restrictions (
	Restriction_Type varchar(16),
	Restriction_Method varchar(16),
	Ids bigint[],
	Command_Id varchar(32),
	CONSTRAINT Restrictions_PK PRIMARY KEY (Restriction_Type, Restriction_Method, Command_Id)
)

-- Add procedure to add bot and server rows.
-- Add function to get the server prefix.

