const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "clear-suggestions",
    category: "misc",
    utilisation: "{prefix}clear-suggestions",
    aliases: ['cs', 'clears', 'clearsuggestions'],
    description: "Clears the suggestions channel. (OWNERS ONLY)",
    usage: "[]",
    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const author = message.member;
        const suggestionChannel = message.guild.channels.cache.find(c => c.id === '834408699291631634');
        const logChannel = message.guild.channels.cache.find(c => c.id === '834408700579282947');

        const embed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setAuthor(author.displayName, author.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Cleared Suggestions Successfully.`)
        .setTimestamp();

        const logsEmbed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setAuthor(author.displayName, author.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Cleared Suggestions.`)
        .setDescription(stripIndents`**- Cleared by:** ${author}
        **- Channel:** ${suggestionChannel}`)
        .setTimestamp();

        if (!message.member.roles.cache.has('834435269234786344')) {
            return message.reply("You cannot remove suggestions.")
        } else {
            logChannel.send(logsEmbed);
            message.channel.send(embed)
                .then(m => m.delete({ timeout: 5000}));
            suggestionChannel.bulkDelete(100, true);
            return;
}
    }
}