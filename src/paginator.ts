import { ClientUser, Message, MessageEmbed, MessageReaction } from "discord.js";
import { bot } from "./index"

type PageCreator = (page: number) => MessageEmbed;
interface PaginatorOptions {
    "allowedUsers"?: string | string[],
    "initialPage"?: number,
    "pageCount": number
    "inactivityTimeout"?: number
}
export function createReactionPaginator(next: PageCreator, msg: Message, options: PaginatorOptions) {
    let page = options.initialPage ?? 1;
    msg.react("⬅️");
    msg.react("➡️");
    msg.createReactionCollector((reaction: MessageReaction, user: ClientUser)=>{
        if (user == bot.user) return false;
        if (options.allowedUsers) {
            let allowedUsers = Array.isArray(options.allowedUsers) ? options.allowedUsers : [options.allowedUsers]
            if (!allowedUsers.includes(user.id)) return false;
        }
        switch (reaction.emoji.name) {
            case "⬅️":
                if (page <= 1) break;
                msg.edit(next(--page))
                break;
            case "➡️":
                if (page >= options.pageCount) break;
                msg.edit(next(++page))
                break;
        }
        reaction.users.remove(user)
        return true;
    }, {"idle": options.inactivityTimeout}).once("end", (reason)=>{
        msg.delete();
    })
}