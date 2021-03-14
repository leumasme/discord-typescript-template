import { Client } from "discord.js"
import { config as loadEnv } from "dotenv"
loadEnv()

var bot = new Client();

bot.on("ready", ()=>{
    console.log("Hello, Discord!")
})

bot.login(process.env.TOKEN).catch((e: Error)=>{
    console.log(e.message);
    console.log("You should have a Discord Token in your .env File")
})