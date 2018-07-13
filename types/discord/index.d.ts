import { Snowflake } from "discord.js";

declare module "discord.js" {
    interface Client {
        locked: boolean
        bbkLocked: boolean
        lockedChannels: Snowflake[]
        bbkLockedChannels: Snowflake[]
        music: any
    }

    interface Message {
        deleted: boolean
    }

    interface Guild {
        readonly data: any
    }

    interface Channel {
        readonly data: any
    }
}
