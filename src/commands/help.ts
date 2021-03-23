import { MessageEmbed } from "discord.js"
import { ChannelTarget, Command, commands, Permission } from "../commandLoader"
import { createReactionPaginator } from "../paginator";

function getNthPage(page: number = 1) {
    let embed = new MessageEmbed();
    embed.setTitle("Help")
    embed.setFooter("Page " + page + "/" + Math.ceil(commands.length / 10));
    embed.addFields(commands.filter((e) => e.name != "help").map((c) =>
        ({ "name": c.name, "value": c.description ?? "No description" })
    ).slice(10 * (page - 1), 10 * page))
    return embed;
}

export default ({
    "name": "help",
    "execute": (msg, args) => {
        let embed = getNthPage()
        msg.channel.send(embed).then(reply => {
            msg.delete();
            createReactionPaginator(getNthPage, reply, {
                "allowedUsers": msg.author.id,
                "pageCount": commands.length / 10,
                "inactivityTimeout": 10000
            })
        });
    },
    "permissions": Permission.Anyone,
    "channels": ChannelTarget.Any
} as Command)