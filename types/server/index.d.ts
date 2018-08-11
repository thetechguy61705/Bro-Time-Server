import { Snowflake } from "discord.js";
import { Readable, Duplex } from "stream";

export type DiscordResolvable<T> = Snowflake | string | { (value: T): boolean };

export interface IExecutable<T> {
    exec(arg: T): boolean | void
}

export interface ILoadable<T> {
    load(arg: T): void
}

export interface MusicStream extends StreamCache {
    url: string
    title: string
    author: string
}

export interface MusicSearchResult {
    title: string
    author: string
    url: string
    description?: string
    tags?: string
    series?: string
    source?: string
}
