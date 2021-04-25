const Discord = require("discord.js");

module.exports = {
    name: "snipe",
    aliases: [],
    category: "misc",
    utilisation: "{prefix}snipe",
    description: "Snipes the latest deleted message.",
    run: async (client, message, args, snipes) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        const msg = snipes.get(message.channel.id);
        if(!msg) {
            return message.channel.send("There is nothing to snipe.").catch(err => {
                if(err) return console.log(err);
            })
        }

        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(msg.author, msg.author2.avatarURL({ dynamic: true }))
        .setDescription(msg.content)
        .setImage(msg.image)
        .setTimestamp(msg.time)

        message.channel.send(embed);
        return snipes.clear();

    }
}