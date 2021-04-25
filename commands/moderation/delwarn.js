const db = require('../../models/warns');
const Discord = require("discord.js");

module.exports = {
    name : 'delwarn',
    aliases: ['unwarn'],
    category: "moderation",
    utilisation: "{prefix}delwarn <warnID>",
    description: "Deletes a warn from a member.",
    run : async(client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;

        if(!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('You do not have permission to use this command.')
        const author = message.author;
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Delwarn\nDeletes a warn of a member.`)
                .addField("Usage:", `${prefix}Delwarn <member> <id>`, false)
                .addField("Exmaple:", `${prefix}Delwarn Tanshi#6067 1`, false)
                .addField("Permissions:", `MUTE_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if(!user) return message.channel.send('User not found.')

        if(!args[1]) {
            return message.channel.send("No warn specified to delete.")
        }

        db.findOne({ guildid : message.guild.id, user: user.user.id}, async(err,data) => {
            if(err) throw err;
            if(data) {
                let number = parseInt(args[1]) - 1

                    if (number < data.content.length) {
                        data.content.splice(number, 1)
                        data.save()
                        if (data.content.length==0) {
                            await db.findOneAndDelete({ user: user.user.id, guildid: message.guild.id})
                            return message.channel.send(`Deleted Warn #${parseInt(args[1])}`)
                        }
                        return message.channel.send(`Deleted Warn #${parseInt(args[1])}`)
                    } else {
                        return message.channel.send("That warning doesn't exist")
                    }

                    
            } else {
                message.channel.send('This user does not have any warns in this server!')
            }
        })

        const logsEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setTitle("Warn Deleted")
            .setDescription(`${user.user.tag} had his warn deleted:`)
            .addField(`**By:**`, `${author.tag}`, false)
            .addField(`**Warn Id:**`, `${parseInt(args[1])}`)
            .setFooter(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

            logChannel.send(logsEmbed);

    }
}