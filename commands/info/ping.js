const Discord = require("discord.js");
const prefix = require("../../prefix");
const ms = require("ms");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

module.exports = {
    name: "ping",
    aliases: [],
    category: "info",
    description: "Pings you and this bot.",
    utilisation: "{prefix}ping",
    run: async (client, message, args) => {
        
        if(!message.content.startsWith(prefix))return;

            const msg = await message.channel.send(`Pinging.`);
            msg.edit(`Pinging..`);
            msg.edit(`Pinging...`);
            msg.edit(`Pong!\nYour ping is ${Math.floor(msg.createdAt - message.createdAt)}ms\nBot Ping ${Math.round(client.ws.ping)}ms`);
            
        }

}