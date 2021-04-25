const Discord = require("discord.js");
const prefix = require("../../prefix");

module.exports = {
    name: 'help',
    aliases: [],
    category: 'info',
    utilisation: '{prefix}help [command name]',
    description: "General Help",

    run: async (client, message, args) => {

        if(!message.content.startsWith(prefix))return;

        if (!args[0]) {
            const info = message.client.commands.filter(x => x.category == 'info').map((x) => '`' + x.name + '`').join(', ');
            const misc = message.client.commands.filter(x => x.category == 'misc').map((x) => '`' + x.name + '`').join(', ');
            const moderation = message.client.commands.filter(x => x.category == 'moderation').map((x) => '`' + x.name + '`').join(', ');

            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor('ORANGE')
                    .setAuthor('Help')
                    .addField('Info', info, false)
                    .addField('Miscellaneous', misc, false)
                    .addField('Moderation', moderation, false)
                    .setTimestamp()
                    .setDescription(`All the commands available:`)
            );
        } else {
            const command = message.client.commands.get(args.join(" ").toLowerCase()) || message.client.commands.find(x => x.aliases && x.aliases.includes(args.join(" ").toLowerCase()));

            if (!command) return message.channel.send(`❌ - I did not find this command !`);

            message.channel.send({
                embed: {
                    color: 'ORANGE',
                    author: { name: 'Help' },
                    fields: [
                        { name: 'Name', value: command.name, inline: true },
                        { name: 'Category', value: command.category, inline: true },
                        { name: 'Aliase(s)', value: command.aliases.length < 1 ? 'None' : command.aliases.join(', '), inline: true },
                        { name: 'Utilisation', value: command.utilisation.replace('{prefix}', prefix), inline: true },
                        { name: 'Description', value: command.description, inline: true },
                    ],
                    timestamp: new Date(),
                    description: 'Find information on the command provided.\nMandatory arguments `<>`, optional arguments `[]`.',
                }
            });
        };
    },
};