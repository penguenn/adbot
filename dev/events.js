const { footerTxt, footerImg, embedColor } = require('../config.js');
const Discord = require("discord.js");
const shardReady = async (client, id) => {
	try {
		console.info(`Connected to Discord. Shard ${id} ready.`);
		const status = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setAuthor(`Connecting to shard.`, footerImg)
			.setDescription('<:bfdyes:719692430420607036> A shard just respawned!')
			.setAuthor('AdBot Status')
			.addFields([{name: `Shard ${id}`, value: `Online`}])
			.setTimestamp()
			.setFooter(footerTxt, footerImg)
		let channel = client.channels.cache.get('729788794299220060')
		channel.bulkDelete(5)
		channel.send(status)
	} catch (error) {
		console.error(error)
	}

	client.user.setPresence({
		status: 'online',
		activity: {
			name: `ad money! | ad help`,
			type: 'WATCHING'
		}
	});
}

const exit = async (code) => {
	try {
		console.info(`Disconnecting from Discord. All shards turning off.`);
		const status = new Discord.MessageEmbed()
			.setColor('#FF0000')
			.setAuthor(`Disconnecting from process with code ${code}.`, footerImg)
			.setDescription('<:cancel:730661815670800434> Bot process turning off!')
			.setAuthor('AdBot Status')
			.addFields([{name: `All Shards`, value: `Offline`}])
			.setTimestamp()
			.setFooter(footerTxt, footerImg)
		let channel = client.channels.cache.get('729788794299220060')
		channel.bulkDelete(5)
		channel.send(status)
	} catch (error) {
		console.error(error)
	}

	client.user.setPresence({
		status: 'online',
		activity: {
			name: `ad money! | ad help`,
			type: 'WATCHING'
		}
	});
}

const guildCreate = async (guild, client, embedColor, footerImg, footerTxt) => {
	const joinMessage = new Discord.MessageEmbed()
		.setColor(embedColor)
		.setAuthor('Nice to meet you!', footerImg)
		.setDescription(`Hello, I was added to your server, **${guild.name}**`)
		.addFields([
			{ name: 'Get Started!', value: 'Type: `ad setup`' },
			{ name: 'Make Revenue!', value: 'I was made to help you make money from your Discord server. Members of your guild can watch ads through this bot, and the revenue is sent to your PayPal account! You can then set up rewards, such as roles, for those users.' }
		])
		.setTimestamp()
		.setFooter(footerTxt, footerImg)
	guild.owner.send(joinMessage)
	client.shard.broadcastEval(`this.channels.cache.get('730172463467593770').send('I was just added to **${guild.name}** which has \`${guild.memberCount}\` members.')`);
}

const msg = async (message, client, prefix, util) => {
	const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
	try {
		if (!prefixRegex.test(message.content.toLowerCase()) || message.author.bot) return;
		const content = message.content.toLowerCase()
		const [, matchedPrefix] = content.match(prefixRegex);
		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('I can\'t execute that command inside DMs!');
		}
		if (command.dev && !util.isDev(message)) {
			return message.reply('you are not a developer.')
		}
    if (command.admin && !util.isAdmin(message)) {
      return message.reply('you must have `ADMINISTRATOR` to run this command.')
    }
		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}
			return message.channel.send(reply);
		}
		if (!client.cooldowns.has(command.name)) {
			client.cooldowns.set(command.name, new Discord.Collection());
		}
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;
		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait \`${timeLeft.toFixed(1)}s\` before using the \`${command.name}\` command again.`);
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		const botPerms = ['EMBED_LINKS', 'MANAGE_MESSAGES', 'ADD_REACTIONS'];
		if (!message.guild.me.hasPermission(botPerms)) {
			return message.reply(`I need permissions: ${botPerms.join(', ')} to work here. You could alternatively just give me \`ADMINISTRATOR\`.`);
		}
		command.run(client, message, args);
	} catch (error) {
		console.error(`MSG0: ${error}`);
		message.reply(`please report this error code, \`MSG0\`, in my support server. You can join by doing: \`${prefix} invite\`.`);
	}

}
module.exports = { shardReady, msg, guildCreate, exit };
