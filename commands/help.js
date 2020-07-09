const { prefix, important, embedColor, footerImg, footerTxt } = require('../config.js');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Includes all commands, and information on how you can use this bot.',
	aliases: ['commands', 'support'],
	usage: '[command name]',
	cooldown: 3,
};


module.exports.run = async (client, message, args) => {
	if (!args.length) {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setAuthor('AdBot Help Page', footerImg)
			.setDescription(`Send \`${prefix}help [command name]\` to get info on a specific command.`)
			.addFields(
				{ name: '<:YTtools:715769246050680863> Utility', value: '`help` `info` `ping` `invite`', inline: true },
				{ name: '<:cash:729800059952037909> Ads', value: '`setup` `balance`', inline: true },
				{ name: '<:YTsettings:715775070034853970> Other', value: '`premium`', inline: true },
				{ name: 'Important Links', value: important },
			)
			.setTimestamp()
			.setFooter(footerTxt, footerImg);
		try {
			message.channel.send(helpEmbed);
		}
		catch (error) {
			message.reply('Please give me the `EMBED LINKS` permission.');
			console.error(`HLP0: ${error}`);
		}
		return;
	}
	const name = args[0].toLowerCase();
	const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));
	if (!command) { return message.reply('that\'s not a valid command! Do `ad help` for all my commands.'); }

	const alias = (command.aliases ? command.aliases.join(', ') : 'none');
	const usage = (command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``);

	const helpEmbed = new Discord.MessageEmbed()
		.setColor(embedColor)
		.setDescription(`**Command Name:** \`ad ${command.name}\``)
		.addFields(
			{ name: 'Description', value: command.description },
			{ name: 'Aliases', value: alias, inline: true },
			{ name: 'Usage', value: usage, inline: true },
			{ name: 'Cooldown', value: `\`${command.cooldown || 3}\` seconds`, inline: true },
		)
		.setFooter(footerTxt, footerImg)
		.setTimestamp();
	try {
		message.channel.send(helpEmbed);
	}
	catch (error) {
		message.reply('Please give me the `EMBED LINKS` permission.');
		console.error(`HLP1: ${error}`);
	}
};
