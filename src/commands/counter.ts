import { db } from "..";
import { ChannelTarget, Command, Permission } from "../commandLoader"
export default ({
    "name": "counter",
    "description": "A counter demonstrating persistant data!",
    "execute": async (msg, args) => {
        switch (args[1]) {
            case "add":
                await db.member.upsert({
                    create: {
                        guildid: msg.guild!.id,
                        userid: msg.author.id
                    },
                    update: {
                        counter: {
                            increment: 1
                        }
                    },
                    where: {
                        guildid_userid: {
                            guildid: msg.guild!.id,
                            userid: msg.author.id
                        }
                    }
                });
                msg.channel.send("Your counter has been increased!")
                break;
            case "view":
                let counter = await db.member.findUnique({
                    where: {
                        guildid_userid: {
                            guildid: msg.guild!.id,
                            userid: msg.author.id
                        }
                    },
                    select: {
                        counter: true
                    }
                })
                msg.channel.send("Your counter is currently " + ((counter?.counter) ?? "not set"))
                break;
        }
    },
    "permissions": Permission.Anyone,
    "channels": ChannelTarget.GuildOnly
} as Command)