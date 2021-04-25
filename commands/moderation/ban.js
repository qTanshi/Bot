const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    aliases: [],
    category: "moderation",
    utilisation: "{prefix}ban <member> <reason>",
    description: "Bans the member.",
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
                .setAuthor("Ban Command")
                .setTitle("Bans a member of this server")
                .addField("Usage:", `${prefix}Ban <member> <reason>`, false)
                .addField("Exmaple:", `${prefix}Ban Tanshi#6067 Advertising`, false)
                .addField("Permissions:", `BAN_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        // No reason
        if (!args[1]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setAuthor("Ban Command")
                .setTitle("Bans a member of this server")
                .addField("Usage:", `${prefix}Ban <member> <reason>`, false)
                .addField("Exmaple:", `${prefix}Ban Tanshi#6067 Advertising`, false)
                .addField("Permissions:", `BAN_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        // No author permissions
        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ You do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({ timeout: 5000 }));

        }
        // No bot permissions
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ I do not have permissions to ban members. Please contact a staff member")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        // No member found
        if (!toBan) {
            return message.reply("Couldn't find that member, try again")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Can't ban urself
        if (toBan.id === message.author.id) {
            return message.reply("You can't ban yourself...")
                .then(m => m.delete({ timeout: 5000 }));
        }

        // Check if the user's banable
        if (!toBan.bannable) {
            return message.reply("I can't ban that person due to role hierarchy, I suppose.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        const embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setAuthor(toBan.user.username, toBan.user.displayAvatarURL({ dynamic: true }))
            .setTitle("User Banned")
            .setThumbnail(toBan.user.displayAvatarURL({ dynamic: true }))
            .setFooter(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setTimestamp()
            .setDescription(stripIndents`**- Banned member:** ${toBan}
            **- Banned by:** ${message.member}
            **- Reason:** "${args.slice(1).join(" ")}"`);

        const promptEmbed = new Discord.MessageEmbed()
            .setColor("#00ff00")
            .setAuthor(`This verification becomes invalid after 30s.`)
            .setDescription(`Do you want to ban ${toBan} for\n"${args.slice(1).join(" ")}"?`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        const aftermathEmbed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .setAuthor(toBan.user.username, toBan.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`User Banned Successfully`)
            .setThumbnail(toBan.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${toBan} was banned because:\n"${args.slice(1).join(" ")}"`)
            .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        toBan.send(new Discord.MessageEmbed()
            .setTitle(`You have been banned!`)
            .setAuthor(author.tag, author.displayAvatarURL({ dynamic: true }))
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addField(`**In:**`, `${guild.name}`, true)
            .addField(`**By:**`, `${author.tag}`, true)
            .addField(`**Reason:**`, `"${reason}"`, false)
            .setFooter(toBan.user.username, toBan.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("RED")
        )

        // Send the message
        await message.channel.send(promptEmbed).then(async msg => {
            // Await the reactions and the reactioncollector
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            // Verification stuffs
            if (emoji === "✅") {
                msg.delete();

                toBan.ban({days: 7, reason: `${args.slice(1).join(" ")}`})
                    .catch(err => {
                        if (err) return message.channel.send(`Well... that didn't work out. Here's the error:\n${err}`)
                    });

                message.channel.send(aftermathEmbed)
                    .then(m => m.delete({ timeout: 10000 }))
                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`ban canceled.`)
                    .then(m => m.delete({ timeout: 10000 }));
            }
        });
    }
};