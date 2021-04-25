const Discord = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "unmute",
    aliases: [],
    utilisation: "{prefix}unmute <member>",
    category: "moderation",
    description: "Unmutes a member",
    usage: "[mention]",
    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        if(message.deletable) {
            message.delete();
        }

        const logChannel = message.guild.channels.cache.find(c => c.id === "834408700579282947") || message.channel;

        let tounmute = message.mentions.members.first();

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("GREEN")
                .setTitle(`Command: ${prefix}Unstfu\nUnstfus a member`)
                .addField("Usage:", `${prefix}Unstfu <member>`, false)
                .addField("Exmaple:", `${prefix}Unstfu Tanshi#6067`, false)
                .addField("Permissions:", `MUTE_MEMBERS`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if(!tounmute) return message.reply("Couldn't find that user.");
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            return message.reply("❌ You do not have permissions to unmute members.")
                .then(m => m.delete({ timeout: 5000 }));
        }

        let muterole = message.guild.roles.cache.find(role => role.id === '834436096536215592');

        if(!muterole) {
            return message.reply(`The muted role doesn't exist.`);
        }
        
        if(!tounmute.roles.cache.find(role => role === muterole)) {
            return message.reply("That user isn't muted.");
        }

        const embed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor("User Unmuted")
        .setThumbnail(tounmute.user.displayAvatarURL({ dynamic: true }))
        .setFooter(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setTimestamp()
        .setDescription(stripIndents`**- Unmuted member:** ${tounmute}
        **- Unmuted by:** ${message.member}`);

        const aftermathEmbed = new Discord.MessageEmbed()
        .setColor("GREEN")
        .setAuthor(`User Unmuted Successfully`)
        .setThumbnail(tounmute.user.displayAvatarURL({ dynamic: true }))
        .setDescription(stripIndents`${tounmute} was unmuted.`)
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()

        function unmute() {
            tounmute.roles.remove(muterole);
            logChannel.send(embed);
            message.channel.send(aftermathEmbed)
        }

        unmute();

    }
}