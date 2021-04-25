const Discord = require("discord.js");

module.exports = {
    name: "avatar",
    category: "misc",
    aliases: ['pfp'],
    utilisation: "{prefix}avatar [member]",
    description: "Shows the avatar of a member.",
    usage: "[ mention ]",
    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const channel = message.channel;
        const author = message.member;
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
        const target = message.mentions.users.first() || message.author;

        

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Avatar\nShows the avatar a member`)
                .addField("Usage:", `${prefix}Avatar <member>`, false)
                .addField("Exmaple:", `${prefix}Avatar Tanshi#6067`, false)
                .addField("Permissions:", `None`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if (!target) {
            return message.reply("Can't find the specified user.");
        }

        const embed = new Discord.MessageEmbed()
        .setColor(roleColor)
        .setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
        .setTitle(`${target.tag}'s Avatar`)
        .setImage(target.avatarURL({ dynamic: true, size: 1024 }))
        .setFooter(author.displayName, author.user.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        channel.send(embed);

    }
}