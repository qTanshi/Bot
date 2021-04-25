const db = require('../../models/warns')
const Discord = require("discord.js");

module.exports = {
    name : 'clearwarns',
    aliases: ['unwarnall', 'clearwarns'],
    category: "moderation",
    utilisation: "{prefix}clearwarns <member>",
    description: "Clears all warnings for a member.",
    run : async(client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;
        const author = message.author;

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Clearwarns\nClears all warns a member has.`)
                .addField("Usage:", `${prefix}Clearwarns <member>`, false)
                .addField("Exmaple:", `${prefix}Clearwarns Tanshi#6067`, false)
                .addField("Permissions:", `MUTE_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if(!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('You do not have permission to use this command.')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!user) return message.channel.send('User not found.')
        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                await db.findOneAndDelete({ user : user.user.id, guildid: message.guild.id})
                return message.channel.send(`Cleared all of ${user.user.tag}'s warns`)
            } else {
                return message.channel.send('This user does not have any warns in this server!')
            }
        })

        const logsEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setTitle("Warns Cleared")
            .setDescription(`${user.user.tag} had his warnings cleared:`)
            .addField(`**By:**`, `${author.tag}`, false)
            .setFooter(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

            logChannel.send(logsEmbed);

    }
}