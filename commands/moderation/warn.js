const db = require('../../models/warns')
const Discord = require('discord.js')

module.exports = {
    name :'warn',
    aliases: [],
    category: "moderation",
    utilisation: "{prefix}warn <member> <reason>",
    description: "Warns a member.",
    /**
     * @param {Message} message
     */
    run : async(client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;
        const author = message.author;
        const channel = message.channel;
        const guild = message.guild;

        if(!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('You do not have permissions to use this command.')

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Warn\nWarns a member.`)
                .addField("Usage:", `${prefix}Warn <member> <reason>`, false)
                .addField("Exmaple:", `${prefix}Warn Tanshi#6067 Advertising`, false)
                .addField("Permissions:", `MUTE_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!user) return message.channel.send('User not found.')
        const reason = args.slice(1).join(" ")
        if(!reason) {
            return message.channel.send("You did not specify a reason to warn.")
        }
        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(!data) {
                data = new db({
                    guildid: message.guild.id,
                    user : user.user.id,
                    content : [
                        {
                            moderator : message.author.id,
                            reason : reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason : reason
                }
                data.content.push(obj)
            }
            data.save()
        });
        user.send(new Discord.MessageEmbed()
            .setTitle(`You have been warned!`)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField(`**In:**`, `${guild.name}`, true)
            .addField(`**By:**`, `${author.tag}`, true)
            .addField(`**Reason:**`, `"${reason}"`, false)
            .setFooter(user.user.username, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("RED")
        )
        channel.send(new Discord.MessageEmbed()
            .setDescription(`:white_check_mark:  ***${user.user.tag} has been warned noob faggot ez *** **|| ${reason}**`)
            .setColor('GREEN')
        )

        const logsEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setTitle("User Warned")
            .setDescription(`${user.user.tag} got warned:`)
            .addField(`**By:**`, `${author.tag}`, false)
            .addField(`**Reason:**`, `"${reason}"`, false)
            .setFooter(user.user.tag, user.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

            logChannel.send(logsEmbed);

    }
}