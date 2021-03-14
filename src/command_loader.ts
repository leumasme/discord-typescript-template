import { Client, GuildMember, Message, User } from "discord.js";
import * as fs from "fs";

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
    "execute": (msg: Message, args: string[]) => void;
}

export function checkPermissions(member: GuildMember | User, shouldHave: Permission): boolean {
    switch (shouldHave) {
        case Permission.Administrator:
            if (member instanceof GuildMember && member.hasPermission("ADMINISTRATOR")) return true;
        case Permission.BotAdmin:
            if (member.id == "412691653573345290") true;
        case Permission.Anyone:
            return true;
    }
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

var commands: { [key: string]: Command } = {};

export async function load(bot: Client) {
    await loadCommands();
    bot.on("message", (msg)=>{
        if (msg.content.startsWith("!")) {
            let args = msg.content.substr(1).split(" ");
            let cmd = commands[args[0]];
            if (cmd) {
                if (checkPermissions(msg.member ?? msg.author, cmd.permissions)) {
                    cmd.execute(msg, args);
                } else {
                    // TODO: Handle Missing Permissions
                }
            }
        }
    })
}

export function loadCommands() {
    commands = {};
    return new Promise<void>((resolve, reject) => {
        fs.readdir("./build/commands", (err, elems) => {
            console.log("hi " + JSON.stringify(elems));
            for (let fname of elems) {
                let command = require("./commands/" + fname).default;
                if (isCommand(command)) {
                    commands[command.name] = command
                    console.log(command.name)
                }
            }
            resolve();
        })
    })
}