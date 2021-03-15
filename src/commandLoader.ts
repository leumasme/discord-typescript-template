import { Client, DMChannel, GuildMember, Message, NewsChannel, TextChannel, User } from "discord.js";
import * as fs from "fs";

export enum ChannelTarget {
    DmOnly,
    GuildOnly,
    Any
}
export enum Permission {
    Anyone,
    Administrator,
    BotAdmin
}
export interface Command {
    "name": string;
    "description"?: string;
    "alias"?: string[];
    "permissions": Permission;
    "channels"?: ChannelTarget;
    "execute": (msg: Message, args: string[]) => void;
}

export function checkChannel(channel: TextChannel | DMChannel | NewsChannel, target: ChannelTarget): boolean {
    if (channel instanceof NewsChannel) return false;
    if (target == ChannelTarget.Any) return true
    return target == (channel instanceof DMChannel ? ChannelTarget.DmOnly : ChannelTarget.GuildOnly)
}

export function checkPermissions(member: GuildMember | User, shouldHave: Permission): boolean {
    switch (shouldHave) { // Check for Permission or Higher using Fallthrough
        case Permission.Anyone:
            return true;
        case Permission.Administrator:
            if (member instanceof GuildMember && member.hasPermission("ADMINISTRATOR")) return true;
        case Permission.BotAdmin:
            if (member.id == "465944198449856522") return true;
    }
    return false;
}

function isCommand(obj: any): obj is Command {
    let cmd = obj as Command;
    if (cmd.name != undefined
        && cmd.execute != undefined
        && cmd.permissions != undefined) {
        return true;
    }
    return false;
}

var commands: Command[] = [];

export async function load(bot: Client) {
    await loadCommands();
    bot.on("message", (msg) => {
        if (msg.content.startsWith("!")) {
            let args = msg.content.substr(1).split(" ");
            let cmd = commands.find((c) => {
                return c.name == args[0] || c.alias?.includes(args[0])
            });
            if (cmd) {
                if (checkPermissions(msg.member ?? msg.author, cmd.permissions)) {
                    if (checkChannel(msg.channel, cmd.channels ?? ChannelTarget.Any)) cmd.execute(msg, args);
                } else {
                    // TODO: Handle Missing Permissions
                }
            }
        }
    })
}

export function loadCommands() {
    commands = [];
    return new Promise<void>((resolve, reject) => {
        fs.readdir("./build/commands", (err, elems) => {
            for (let fname of elems) {
                delete require.cache[require.resolve("./commands/" + fname)]
                let command = require("./commands/" + fname).default;
                if (isCommand(command)) {
                    commands.push(command)
                    console.log("Loaded Command "+command.name + " :  " + command.description)
                }
            }
            resolve();
        })
    })
}