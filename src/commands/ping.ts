import { ChannelTarget, Command, Permission } from "../commandLoader"
export default ({
    "name": "ping",
    "description": "Responds to you!",
    "execute": (msg, args) => { msg.channel.send("Hello!") },
    "permissions": Permission.Anyone,
    "alias": ["pong"],
    "channels": ChannelTarget.Any
} as Command)