import { Client, Message } from "discord.js";
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
            if (commands[args[0]]) {
                commands[args[0]].execute(msg, args);
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