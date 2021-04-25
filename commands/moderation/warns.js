const db = require('../../models/warns')
const Discord = require('discord.js');

module.exports = {
    name :'warns',
    aliases: ["warnings"],
    category: "moderation",
    utilisation: `{prefix}warns <me> / <member>`,
    /**
     * @param {Message} message
     */
    run : async(client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const reason = args.slice(1).join(" ")
        
        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Warns\nShow all warns a member has.`)
                .addField("Usage:", `${prefix}Warns <member> / me`, false)
                .addField("Exmaple:", `${prefix}Warns me\n${prefix}Warns Tanshi#6067`, false)
                .addField("Permissions:", `None / MUTE_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }
        
        if(args[0] === 'me') {
            return db.findOne({ guildid: message.guild.id, user: message.author.id}, async(err, data) => {
                if(err) throw err;
                if(data) {
                    message.channel.send(new Discord.MessageEmbed()
                        .setTitle(`${message.author.tag}'s warns`)
                        .setDescription(
                            data.content.map(
                                (w, i) => 
                                `\`${i + 1}\` | Admin: ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`
                            )
                        )
                        .setColor("RANDOM")
                    )
                } else {
                    message.channel.send('You have not been warned yet')
                }
    
            })
        }
        
        if(!message.member.hasPermission('MUTE_MEMBERS')) return message.channel.send('You do not have permissions to use this command.')

        db.findOne({ guildid: message.guild.id, user: user.user.id}, async(err, data) => {
            if(err) throw err;
            if(data) {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`${user.user.tag}'s warns`)
                    .setDescription(
                        data.content.map(
                            (w, i) => 
                            `\`${i + 1}\` | Admin: : ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`
                        )
                    )
                    .setColor("RANDOM")
                )
            } else {
                message.channel.send('User has not been warned yet')
            }

        })
    }
}