import { Command, Permission } from "../command_loader"
export default ({
    "name": "ping",
    "execute": (msg, args) => { msg.channel.send("Hello!") },
    "permissions": Permission.Anyone
} as Command)