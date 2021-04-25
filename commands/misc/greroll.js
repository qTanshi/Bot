const Discord = require('discord.js')

module.exports = {
    name : 'greroll',
    aliases: ["giveawayreroll", "gredo", "grepick"],
    category: "misc",
    utilisation: "{prefix}greroll <messageID>",
    description: "Rerolls a giveaway.",
    run : async(client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Greroll\nRerolls a giveaway.`)
                .addField("Usage:", `${prefix}Greroll <messageID>`, false)
                .addField("Exmaple:", `${prefix}Greroll 833938611350274068`, false)
                .addField("Permissions:", `MANAGE_MESSAGES`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You do not have permission')

        let messageID = args[0];
        client.giveawaysManager.reroll(messageID).then(() => {
            message.channel.send('Success! Giveaway rerolled!');
        }).catch((err) => {
            message.channel.send('No giveaway found for ' + messageID + ', please check and try again');
        });
    }
}