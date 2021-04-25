const ms = require('ms')
const Discord = require("discord.js");

module.exports = {
    name: 'gremove',
    aliases: ["giveawayremove", "gstop"],
    category: "misc",
    utilisation: "{prefix}gremove <messageID>",
    description: "Stops a giveaway.",
    run: async(client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Gremove\nRemoves a giveaway.`)
                .addField("Usage:", `${prefix}Gremove <messageID>`, false)
                .addField("Exmaple:", `${prefix}Gremove 833938611350274068`, false)
                .addField("Permissions:", `MANAGE_MESSAGES`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if(!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.channel.send("You are not allowed to stop/remove giveaways.")
        }

        let messageID = args[0];

        client.giveawaysManager.delete(messageID).then(() => {
            message.channel.send('Success! Giveaway stopped!');
        })
        .catch((err => {
            console.log(err)
        }));

    }
}