import { Client } from "discord.js"
import { config as loadEnv } from "dotenv"
import { load } from "./commandLoader";
import { PrismaClient } from "@prisma/client";
loadEnv()

export var db = new PrismaClient();
export var bot = new Client();

bot.on("ready", () => {
    console.log("Hello, Discord!");
    load(bot);
})

bot.login(process.env.TOKEN).catch((e: Error) => {
    console.log(e.message);
    console.log("You should have a Discord Token in your .env File")
})