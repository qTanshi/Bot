const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "mute",
    category: "moderation",
    description: "Permanently mutes the user",
    aliases: ["permmute"],
    utilisation: "{prefix}mute <member> <reason>",
    usage: "[mention | reason]",
    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        let tomute = message.mentions.members.first();
        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;

        if (message.deletable) {
            message.delete();
        }

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setTitle(`Command: ${prefix}Stfu\nPermanently stfus a member`)
                .addField("Usage:", `${prefix}Stfu <member> <reason>`, false)
                .addField("Exmaple:", `${prefix}Stfu Tanshi#6067 Swearing`, false)
                .addField("Permissions:", `MUTE_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if(!tomute) return message.reply("Couldn't find that user.");
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ You do not have permissions to mute members.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        if(!args[1]) {
            return message.reply("You must state a reason.");
        }

        if(tomute.id === '834413330016895007') {
         return message.reply("Why mute me?")
            .then(m => m.delete({ timeout: 5000 }));
        }

        if(tomute.id === message.author.id) {
            return message.reply("You can't mute yourself.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        if(message.mentions.members.first().roles.highest.position > message.member.roles.highest.position) {
            return message.reply("The user you tried to mute has a higher role than you.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        let muterole = message.guild.roles.cache.find(role => role.id === '834436096536215592');

        if(!muterole) {
            try{
                muterole = await message.guild.roles.create({
                    name: "Muted",
                    color: "#818386",
                    permissions:{
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    }
                })
            }catch(e){
                console.log(e.stack);
            }
        }

        const promptEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`This verification becomes invalid after 30s.`)
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Do you want to mute ${tomute} for \n"${args.slice(1).join(" ")}"?`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor("User Muted")
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setFooter(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setDescription(stripIndents`**- Muted member:** ${tomute}
        **- Muted by:** ${message.member}
        **- Reason:** "${args.slice(1).join(" ")}"`);

        const aftermathEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`User Muted Successfully`)
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${tomute} was muted because:\n"${args.slice(1).join(" ")}"`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()


        //send embed
        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                await(tomute.roles.add(muterole))
                    .catch(err => {
                        if(err) return message.channel.send(`Well... That didn't work out, here's why:\n${err}`)
                    });

                logChannel.send(embed);
                message.channel.send(aftermathEmbed);
            } else if (emoji === "❌") {
                msg.delete();
                message.reply(`Mute canceled.`)
                    .then(m => m.delete({timeout: 5000}));
            }
        })

    }
}