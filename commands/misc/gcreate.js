const Discord = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "gcreate",
    aliases: ["giveawaycreate", "gstart", "giveaway"],
    category: "misc",
    utilisation: "{prefix}gcreate <channel> <duration> <winners> <@everyone (true/false)> <prize>",
    description: "Starts a giveaway",

    run: async (client, message, args) => {

        const prefix = require("../../prefix");

        if(!message.content.startsWith(prefix))return;

        if(!args[0]) {
            noArgs = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`Command: ${prefix}Gcreate\nCreate a giveaway.`)
                .addField("Usage:", `${prefix}Gcreate <channel> <duration> <winners> <@everyone (true/false)> <prize>`, false)
                .addField("Exmaple:", `${prefix}Gcreate #giveaways 15m 2 Discord Nitro`, false)
                .addField("Permissions:", `MANAGE_MESSAGES`, false)
                .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
                message.channel.send(noArgs);
            return;
        }

        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send('You are not allowed to start giveaways.');

        let channel = message.mentions.channels.first();

        if (!channel) return message.channel.send('Please provide a channel');

        let giveawayDuration = args[1];

        if(!giveawayDuration || isNaN(ms(giveawayDuration))) return message.channel.send('Please provide a valid duration.');

        let giveawayWinners = args[2];

        if(isNaN(giveawayWinners) || (parseInt(giveawayWinners) <= 0)) return message.channel.send("Please provide a valid number of winners.")
        
        let everyone = args[3];

        if(!everyone) return message.channel.send("Please specify whether to mention everyone or not (true/false)");

        let giveawayPrize = args.slice(4).join(" ");
    
        if (!giveawayPrize) return message.channel.send('Ok then, I\'ll give away nothing');

        if(everyone === 'true') {
            client.giveawaysManager.start(channel, {
                time: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: giveawayWinners,
                hostedBy: message.author,
    
                messages: {
                    giveaway: "@everyone\n\n" + "GIVEAWAY",
                    giveawayEnded: "@everyone\n\n" + "GIVEAWAY ENDED",
                    timeRemaining: "Time remaining: **{duration}**",
                    inviteToParticipate: "React with 🎉 to enter",
                    winMessage: "Congrats {winners}, you won **{prize}**",
                    embedFooter: "Giveaway time!",
                    noWinner: "Couldn't determine a winner",
                    hostedBy: "Hosted by {user}",
                    winners: "winner(s)",
                    endedAt: "Giveaway Ended",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            })
    
            message.channel.send(`Giveaway starting in ${channel}`);
        } else if (everyone === 'false') {
            client.giveawaysManager.start(channel, {
                time: ms(giveawayDuration),
                prize: giveawayPrize,
                winnerCount: giveawayWinners,
                hostedBy: message.author,
    
                messages: {
                    giveaway: "GIVEAWAY",
                    giveawayEnded: "GIVEAWAY ENDED",
                    timeRemaining: "Time remaining: **{duration}**",
                    inviteToParticipate: "React with 🎉 to enter",
                    winMessage: "Congrats {winners}, you won **{prize}**",
                    embedFooter: "Giveaway time!",
                    noWinner: "Couldn't determine a winner",
                    hostedBy: "Hosted by {user}",
                    winners: "winner(s)",
                    endedAt: "Giveaway Ended",
                    units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                        pluralS: false
                    }
                }
            })
            message.channel.send(`Giveaway starting in ${channel}`);
        }
    }
}