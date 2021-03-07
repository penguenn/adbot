const { embedColor, footerImg, footerTxt } = require('../config.js');
const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Tells you more about the bot.',
	aliases: ['about'],
	usage: '[command name]',
	cooldown: 3,
};

module.exports.run = async (client, message, _) => {
	const promises = [
		client.shard.fetchClientValues('guilds.cache.size'),
		client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
	];
	Promise.all(promises)
		.then(results => {
			const days = Math.floor(client.uptime / 86400000);
			const hours = Math.floor(client.uptime / 3600000) % 24;
			const minutes = Math.floor(client.uptime / 60000) % 60;
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
			const info = new Discord.MessageEmbed()
				.setColor(embedColor)
				.setAuthor(`AdBot | Uptime: ${days} days, ${hours} hours, ${minutes} minutes.`, footerImg)
				.addFields(
					{ name: 'Version', value: '1.1.a', inline: true },
					{ name: 'Library', value: 'discord.js', inline: true },
					{ name: 'Developer', value: '[Café Development](https://discord.gg/J4xpV78Cbs)', inline: true },
					{ name: 'Servers', value: `\`${totalGuilds}\``, inline: true },
					{ name: 'Members', value: `\`${totalMembers}\``, inline: true },
					{ name: 'Shards', value: `\`${message.guild.shardID}\` of \`${client.shard.count}\``, inline: true },
					{ name: 'Memory', value: '`' + eval(Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 10) / 10) + '` MB', inline: true },
					{ name: 'Invite', value: '[Invite Me](https://bit.ly/2DjZSZC)', inline: true },
					{ name: 'Discord', value: '[Join Server](https://discord.gg/J4xpV78Cbs)', inline: true },

				)
				.setTimestamp()
				.setFooter(footerTxt, footerImg);
			message.channel.send(info);
			message.channel.send(`My Patrons:
    - jacob wafflez#6209
    - WLVF#7958
    - Iara Daisuke#9999
Special thanks to:
    - **Iara Daisuke#9999** for HUGE financial contributions (over $500)!
            
**For commands**, use \`ad help\`. To purchase AdBot premium, do \`ad premium\`.
Want to support this bot? Consider donating 💓 <https://www.buymeacoffee.com/youtube>
            `);
		})
		.catch(console.error);
};
