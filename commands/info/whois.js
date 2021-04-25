const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "whois",
    aliases: ["who", "user"],
    category: "info",
    utilisation: "{prefix}whois [member]",
    description: "Returns user information",
    usage: "[username | id | mention]",
    run: (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const member = getMember(message, args.join(" "));

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';

        // User variables
        const created = formatDate(member.user.createdAt);

        const embed = new Discord.MessageEmbed()
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Member information:', stripIndents`**> Display name:** "${member.displayName}"
            **> Joined at:** ${joined}
            **> Roles:** ${roles}`, true)

            .addField('User information:', stripIndents`**> ID:** ${member.user.id}
            **> Username:** "${member.user.username}"
            **> Tag:** "${member.user.tag}"
            **> Created at:** ${created}`, true)
            
            .setTimestamp()

        message.channel.send(embed);
    }
}