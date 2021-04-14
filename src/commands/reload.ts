import { Command, loadCommands, Permission } from "../commandLoader"
export default ({
    "name": "reload",
    "description": "Reload bot commands without restarting the bot",
    "execute": async (msg) => {
        msg.channel.send("Reloading...")
        await loadCommands();
        msg.channel.send("Reloaded! Make sure you are running tsc --watch for this to work")
    },
    "permissions": Permission.BotAdmin,
} as Command)