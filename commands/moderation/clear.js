const Discord = require("discord.js");

module.exports = {
    name: "clear",
    aliases: ["purge", "nuke"],
    category: "moderation",
    utilisation: "{prefix}clear <number>",
    description: "Clears the chat",
    run: async (client, message, args) => {
    
        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const logChannel = message.guild.channels.cache.find(c => c.id === '834408700579282947');
        const channel = message.channel;

        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You don't have enough permissions.\nPermissions needed: MANAGE_MESSAGES").then(m => m.delete({timeout: 5000}));
        }

        // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor("Clear Command")
                .setTitle("Clears the chat by an amount of numbers.")
                .addField("Usage:", `${prefix}Clear <number>`, false)
                .addField("Exmaple:", `${prefix}Clear 100`, false)
                .addField("Permissions:", `MANAGE_MESSAGES`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I can't delete messages. Please contact a staff member.").then(m => m.delete({timeout: 5000}));
        }

        let deleteAmount2 = args[0];
        let deleteAmount = (parseInt(deleteAmount2) + 1)

        if(deleteAmount > 99) {
            deleteAmount = 99;
        }

        const logsEmbed = new Discord.MessageEmbed()
        .setColor("#00ff00")
        .setAuthor("Messages Cleared")
        .setTitle(`Cleared ${deleteAmount - 1} message/s.`)
        .setDescription(`Channel: ${channel}`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => logChannel.send(logsEmbed))
            .then(deleted => message.channel.send(`I deleted \`${deleteAmount - 1}\` message/s.`))
                .then(m => m.delete({ timeout: 5000 }))
    }
}