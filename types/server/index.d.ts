import { Snowflake } from "discord.js";
import { Readable, Duplex } from "stream";

export type DiscordResolvable<T> = Snowflake | string | { (value: T): boolean };

export interface IExecutable<T> {
    exec(arg: T): boolean | void
}

export interface ILoadable<T> {
    load(arg: T): void
}

export interface MusicStream extends Duplex {
    title?: string
    author?: string
}
