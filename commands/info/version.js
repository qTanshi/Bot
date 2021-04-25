const Discord = require("discord.js");
const prefix = require("../../prefix");
const version = "Alpha 1";

module.exports = {
    name: "version",
    category: "info",
    utilisation: "{prerfix}version",
    alises: [],
    description: "Shows the version of the bot.",
    usage: "[]",
    run: async (client, message, args) => {

        if(!message.content.startsWith(prefix))return;

        const channel = message.channel;
        const author = message.member;

        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`This bot's version is ${version}`)
        .setFooter(author.displayName, author.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

        channel.send(embed);

    }
}