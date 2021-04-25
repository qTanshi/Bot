const Discord = require("discord.js");
const { config } = require("dotenv");
const client = new Discord.Client();
const prefix = require("./prefix");
const mongoose = require("mongoose");
const leveling = require("discord-leveling");
const canvacord = require("canvacord");
const canvas = require("discord-canvas");
const { GiveawaysManager } = require("discord-giveaways");
const welcomeCanvas = new canvas.Welcome()
const fs = require("fs");

const editedMessage = new Discord.Collection()
const snipes = new Discord.Collection()
client.giveawaysManager = new GiveawaysManager(client, "mongodb+srv://visk.snv9l.mongodb.net/Visk2?retryWrites=true&w=majority", { user: "Visk3", pass: "Visk3", useNewUrlParser: true, useUnifiedTopology: true });

client.on("messageUpdate", message => {
  editedMessage.set(message.channel.id, {
    content: message.content,
    author: message.author.tag,
    author2: message.author,
    member: message.member,
    time: message.createdTimestamp,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  })
})

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if (message.content.startsWith(`${prefix}editsnipe`)) {
    const msg2 = editedMessage.get(message.channel.id);
    if (!msg2) {
      return message.channel.send("There is nothing to editsnipe.").catch(err => {
        if (err) return console.log(err);
      })
    }

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(msg2.author, msg2.author2.avatarURL({ dynamic: true }))
      .setDescription(msg2.content)
      .setImage(msg2.image)
      .setTimestamp(msg2.time)

    message.channel.send(embed);
    return editedMessage.clear();
  }
})

client.on(`messageDelete`, message => {
  snipes.set(message.channel.id, {
    content: message.content,
    author: message.author.tag,
    author2: message.author,
    member: message.member,
    time: message.createdTimestamp,
    image: message.attachments.first() ? message.attachments.first().proxyURL : null
  })
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

config({
  path: __dirname + "/.env"
});

mongoose.connect("mongodb+srv://visk.snv9l.mongodb.net/Visk2?retryWrites=true&w=majority", { user: "Visk3", pass: "Visk3", useNewUrlParser: true, useUnifiedTopology: true })

client.on("ready", () => {
  console.log(`The bot is online.`);
  client.user.setPresence({
    activity: {
      name: `${prefix}help`,
      type: "LISTENING",
      url: "https://twitch.tv/pokimane"
    },
    status: "online"
  })
});

const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

fs.readdirSync('./commands').forEach(dirs => {
  const commands = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

  for (const file of commands) {
    const command = require(`./commands/${dirs}/${file}`);
    client.commands.set(command.name, command);
  }
});

for (const file of events) {
  const event = require(`./events/${file}`);
  client.on(file.split(".")[0], event.bind(null, client));
};

client.on("guildMemberAdd", async member => {

  let image = await welcomeCanvas
    .setUsername(member.user.username)
    .setDiscriminator(member.user.discriminator)
    .setMemberCount(member.guild.memberCount)
    .setGuildName(`${member.guild.name}`)
    .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "png" }))
    .setColor("border", "#ffffff")
    .setColor("username-box", "#ffffff")
    .setColor("discriminator-box", "#ffffff")
    .setColor("message-box", "#ffffff")
    .setColor("title", "#ffffff")
    .setColor("Avatar", "#ffffff")
    .setBackground("https://wallpapercave.com/wp/wp5128415.jpg")
    .toAttachment()

  let attachment2 = new Discord.MessageAttachment(image.toBuffer(), "welcome.png")
  const channel = await member.guild.channels.cache.find(ch => ch.id === '834408698243055667')
  channel.send(`<@${member.user.id}>, Welcome to Attiton Community !`, attachment2);
})

client.on("guildMemberRemove", async member => {
  const channel = await member.guild.channels.cache.find(ch => ch.id === '834408698243055667')
  channel.send(`${member.user.tag} left the server :(`);
})

client.on("guildMemberAdd", async (member) => {
  const Captcha = require("captcha-generator-better")
  let captcha = new Captcha()
  const verifiedrole = member.guild.roles.cache.find((r) => r.id === '834408697810649122')
  const guild = member.guild;

  let baseuri = captcha.dataURL

  let base64String = baseuri

  let base64Image = base64String.split(';base64,').pop()

  fs.writeFile('captcha.png', base64Image, { encoding: 'base64' }, function (err) {
    console.log("File created");
  })

  const attachment = new Discord.MessageAttachment("./captcha.png")

  const embed = new Discord.MessageEmbed()
    .attachFiles(attachment)
    .setColor("BLUE")
    .setTitle(`Welcome to ${guild.name}!`)
    .setDescription(`**In order to continue, please complete the Captcha below:**`)
    .setImage("file:///C:/Users/virgi/OneDrive/Desktop/[AC]%20Bots/[AC]%20Utilities/captcha.png")
    .setTimestamp()

  setTimeout(() => {
    console.log("Test");
    member.user.createDM().then(async (channel) => {
      const verifycode = await channel.send("**Complete the Captcha in order to continue:**",
        new Discord.MessageAttachment("./captcha.png"))
      member.send(embed);
  
      let collector = channel.createMessageCollector(m => m.author.id === member.id)
  
      collector.on("collect", async(m) => {
        if (m.content.toUpperCase() === captcha.value) {
          verifycode.delete()
          collector.removeAllListeners();
          await member.send("You successfully verified yourself!").then((m) => m.delete({ timeout: 3000 }))
          return guild.member(member).roles.add(verifiedrole);
        } else if (m.content.toUpperCase() !== captcha.value) {
          verifycode.delete()
          collector.removeAllListeners();
          await channel.send("The code that you sent was incorrect and you will have to retry.").then((m) => m.delete({ timeout: 3000 }))
          return guild.member(member).kick();
          
        }
      })
    })
  }, 1000)
})

client.on("message", async message => {
  const prefix = require("./prefix");

  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const xpChannel = await message.guild.channels.cache.find(ch => ch.id === '834408698696564743');

  let profile = await leveling.Fetch(message.author.id);
  leveling.AddXp(message.author.id, 1);
  reqExp = profile.level * 50
  reqExp0 = 0;
  profilexp2 = profile.xp + 1

  if (profile.level === 0) {
    leveling.AddLevel(message.author.id, 1);
    return leveling.SetXp(message.author.id, 0);
  }

  if (profilexp2 > reqExp) {
    leveling.AddLevel(message.author.id, 1);
    leveling.SetXp(message.author.id, 0);
    message.channel.send(`Congratulations ${message.author.tag}, you reached level ${profile.level + 1}`)

    let user = message.author;
    let output = await leveling.Fetch(user.id);
    if (output.level === 0) {
      leveling.SetLevel(user.id, 1);
    }
    let reqExp2 = output.level * 50

    const rank = new canvacord.Rank()
      .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
      .setLevel(output.level)
      .setRank(1, "hi", false)
      .setCurrentXP(output.xp)
      .setRequiredXP(reqExp2)
      .setStatus(user.presence.status)
      .setProgressBar('#FFA500', "COLOR")
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
    rank.build()
      .then(data => {
        const attachment = new Discord.MessageAttachment(data, 'funny.png')
        xpChannel.send(attachment)
      })

    xpChannel.send(`<@${message.author.id}> reached level ${profile.level + 1}!`)

  }

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  const command = client.commands.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));

  if (cmd.lenght === 0) return;

  if (command)
    command.run(client, message, args, snipes, editedMessage);

  if (message.content.startsWith(`${prefix}level`)) {

    let user = message.mentions.users.first() || message.author;
    let output = await leveling.Fetch(user.id);
    if (output.level === 0) {
      leveling.SetLevel(user.id, 1);
    }
    let reqExp2 = output.level * 50

    const rank = new canvacord.Rank()
      .setAvatar(user.displayAvatarURL({ dynamic: false, format: 'png' }))
      .setLevel(output.level)
      .setRank(1, "hi", false)
      .setCurrentXP(output.xp)
      .setRequiredXP(reqExp2)
      .setStatus(user.presence.status)
      .setProgressBar('#FFA500', "COLOR")
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
    rank.build()
      .then(data => {
        const attachment = new Discord.MessageAttachment(data, 'funny.png')
        message.channel.send(attachment);
      })
  }

})

client.login(process.env.TOKEN)