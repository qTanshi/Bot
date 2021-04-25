const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions");

module.exports = {
    name: "suggest",
    category: "misc",
    aliases: [],
    utilisation: "{prefix}suggest <message>",
    description: "Suggest something to the Staff/Owner.",
    usage: "[text]",
    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const author = message.member;
        const suggestionChannel = message.guild.channels.cache.find(c => c.id === '834408699291631634');

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setTitle(`Command: ${prefix}Suggest\nSuggestions for the staff.`)
                .addField("Usage:", `${prefix}Suggest <suggestion>`, false)
                .addField("Exmaple:", `${prefix}Suggest There should be an Admin role.`, false)
                .addField("Permissions:", `None`, false)
                .addField("Channel:", `${suggestionChannel}`, true)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        const roleColor = author.displayHexColor === "#000000" ? "#ffffff" : author.displayHexColor; 

        const embed = new Discord.MessageEmbed()
        .setColor(roleColor)
        .setAuthor(author.displayName, author.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`${author.user.tag} suggests that:`)
        .setDescription(`"${args.join(" ")}"`)
        .setTimestamp();

        const aftermathEmbed = new Discord.MessageEmbed()
        .setColor(roleColor)
        .setAuthor(author.displayName, author.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Suggestion sent.`)
        .setDescription(`"${args.join(" ")}"`)
        .setTimestamp()

        message.channel.send(aftermathEmbed)
            .then(m => m.delete({ timeout: 10000 }));
        suggestionChannel.send(embed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, -1, ["✅", "❌"]);
        })

    }
}