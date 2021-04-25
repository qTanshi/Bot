const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    utilisation: "{prefix}kick <member> <reason>",
    aliases: [],
    description: "Kicks the member",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        
        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;
        const author = message.author;
        const channel = message.channel;
        const guild = message.guild;
        const reason = args.slice(1).join(" ");

        if (message.deletable) message.delete();

        // No args
        if (!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setAuthor("Kick Command")
                .setTitle("Kicks a member of this server")
                .addField("Usage:", `${prefix}Kick <member> <reason>`, false)
                .addField("Exmaple:", `${prefix}Kick Tanshi#6067 Swearing`, false)
                .addField("Permissions:", `KICK_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        // No reason
        if (!args[1]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor("Kick Command")
                .setTitle("Kicks a member of this server")
                .addField("Usage:", `${prefix}Kick <member> <reason>`, false)
                .addField("Exmaple:", `${prefix}Kick Tanshi#6067 Swearing`, false)
                .addField("Permissions:", `KICK_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        // No author permissions
        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ You do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000}));
        }

        // No bot permissions
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ I do not have permissions to kick members. Please contact a staff member")
                .then(m => m.delete({timeout: 5000}));
        }

        const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        // No member found
        if (!toKick) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({timeout: 5000}));
        }

        // Can't kick urself
        if (toKick.id === message.author.id) {
            return message.reply("You can't kick yourself...")
                .then(m => m.delete({timeout: 5000}));
        }

        // Check if the user's kickable
        if (!toKick.kickable) {
            return message.reply("I can't kick that person due to role hierarchy, I suppose.")
                .then(m => m.delete({timeout: 5000}));
        }
                
        const embed = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(toKick.user.username, toKick.user.displayAvatarURL({ dynamic: true }))
            .setTitle("User Kicked")
            .setThumbnail(toKick.user.displayAvatarURL({ dynamic: true }))
            .setFooter(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(stripIndents`**- Kicked member:** ${toKick}
            **- Kicked by:** ${message.member}
            **- Reason:** "${args.slice(1).join(" ")}"`);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("GREEN")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setThumbnail(toKick.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Do you want to kick ${toKick} for \n"${args.slice(1).join(" ")}"?`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        const aftermathEmbed = new Discord.MessageEmbed()
            .setColor("RED")
            .setAuthor(toKick.user.username, toKick.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`User Kicked Successfully`)
            .setThumbnail(toKick.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${toKick} was kicked because:\n"${args.slice(1).join(" ")}"`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        toKick.send(new Discord.MessageEmbed()
            .setTitle(`You have been kicked!`)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField(`**In:**`, `${guild.name}`, true)
            .addField(`**By:**`, `${author.tag}`, true)
            .addField(`**Reason:**`, `"${reason}"`, false)
            .setFooter(toKick.user.username, toKick.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("RED")
        )

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reaction collector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // The verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Well.... the kick didn't work out. Here's the error ${err}`)
                    });

                logChannel.send(embed);
                message.channel.send(aftermathEmbed)
                    .then(m => m.delete({timeout: 10000}));
            } else if (emoji === "❌") {
                msg.delete();

                

                message.reply(`Kick canceled.`)
                    .then(m => m.delete({timeout: 5000}));
            }
        });
    }
};