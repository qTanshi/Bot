const Discord = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");
const ms = require("ms");

module.exports = {
    name: "tempmute",
    category: "moderation",
    aliases: [],
    utilisation: "{prefix}tempmute <member> <time> <reason>",
    description: "Temporarily mutes a member",
    usage: "[mention | time | reason]",
    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        if(message.deletable) {
            message.delete();
        }

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        let muterole = message.guild.roles.cache.find(role => role.id === '834436096536215592');

        let mutetime = args[1];
        let aMutetime = mutetime * 60 * 1000;
        let tomute = message.mentions.members.first();
        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;

        function unmute() {
            tomute.roles.remove(muterole);
            message.channel.send(unmuteEmbed);
            logChannel.send(unmuteEmbedLogs);
        }

        async function mute() {
            tomute.roles.add(muterole);
            message.channel.send(aftermathEmbed);
            await sleep(aMutetime)
                .then(() => {
                    if(tomute.roles.cache.some(role => role === muterole)) {
                        return;
                    } else {
                        unmute();
                    }
                })
        }

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setTitle(`Command: ${prefix}Tempstfu\nTemporarily stfus a member`)
                .addField("Usage:", `${prefix}Tempstfu <member> <duration (m)> <reason>`, false)
                .addField("Exmaple:", `${prefix}Tempstfu Tanshi#6067 5 Swearing`, false)
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
            return message.reply("You must state a period of time (mintues)");
        }
        
        if(!args[2]) {
            return message.reply("You must state a reason.");
        }

        if(tomute.id === message.author.id) {
            return message.reply("You can't mute yourself.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        if(message.mentions.members.first().roles.highest.position > message.member.roles.highest.position) {
            return message.reply("The user you tried to mute has a higher role than you.")
                .then(m => m.delete({ timeout: 5000 }));
        }

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
        .setDescription(`Do you want to tempmute (${mutetime} minute/s) ${tomute} for \n"${args.slice(2).join(" ")}"?`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        const embed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor("User Tempmuted")
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setFooter(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setDescription(stripIndents`**- Tempmuted member:** ${tomute}
        **- Tempmuted by:** ${message.member}
        **- Duration:** ${mutetime} minute/s
        **- Reason:** "${args.slice(2).join(" ")}"`);

        const aftermathEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor(`User Tempmuted Successfully`)
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${tomute} was tempmuted (${mutetime} minute/s) because:\n"${args.slice(2).join(" ")}"`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        const unmuteEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`User Unmuted`)
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`${tomute} was unmuted automatically\nafter his sentence (${mutetime} minute/s) expired`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        const unmuteEmbedLogs = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`User Unmuted`)
        .setThumbnail(tomute.user.displayAvatarURL({ dynamic: true }))
        .setFooter(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setDescription(stripIndents`**- Unmuted member:** ${tomute}
        **- Tempmuted by:** ${message.member}
        **- Duration:** ${mutetime} minute/s
        **- Reason:** "${args.slice(2).join(" ")}"`);

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                mute();

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();
                message.reply(`Mute canceled.`)
                    .then(m => m.delete({timeout: 5000}));
            }
        })

    }
}