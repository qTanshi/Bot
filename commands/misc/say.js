const Discord = require('discord.js');

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "misc",
    description: "The bot will say anything for you.",
    utilisation: "{prefix}say [embed] <message>",
    usage: "<message>",
    run: async (client, message, args) => {

      const prefix = require("../../prefix");

      if(!message.content.startsWith(prefix))return;

            if (message.deletable) message.delete();
        
            if (!args[0]) {
              noArgs = new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setTitle(`Command: ${prefix}Say\nSay something as the bot.`)
                .addField("Usage:", `${prefix}Say (<embed>) <message>`, false)
                .addField("Exmaple:", `${prefix}Say (<embed>) Hello.`, false)
                .addField("Permissions:", `None`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
            }
        
            const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;
        
            if(args[0].toLowerCase() === "embed") {
              const embed = new Discord.MessageEmbed()
              .setColor(roleColor)
              .setAuthor(message.author.username, message.author.avatarURL({ dynamic: true}))  
              .setTitle(args.slice(1).join(" "))
              .setTimestamp()
              .setImage(client.user.displayAvatarURL)
        
              if(!args[1]) {
                noArgs = new Discord.MessageEmbed()
                .setColor("#00ff00")
                .setTitle(`Command: ${prefix}Say\nSay something as the bot.`)
                .addField("Usage:", `${prefix}Say (<embed>) <message>`, false)
                .addField("Exmaple:", `${prefix}Say (<embed>) Hello.`, false)
                .addField("Permissions:", `None`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
              }
              message.channel.send(embed);
            } else {
              message.channel.send(args.join(" "));
            }
          }
    }
