const { embedColor, footerTxt, footerImg } = require('../config.js');
const { guildExist, setupGuild, getPaypal } = require('../database/firestore.js');
const Discord = require('discord.js');

module.exports = {
	name: 'setup',
	description: 'Set up your server to start earning money!',
	aliases: ['start'],
	admin: true,
	cooldown: 3,
};

module.exports.run = async (client, message, _) => {
	const guildExists = await guildExist(message.guild.id);
	if (!guildExists) {
		message.channel.send('Welcome to AdBot! This bot allows users in your server to watch ads. The revenue generated goes to YOUR server.\n> Click the `✅` emoji below to start the setup.').then(m => {
			m.react('✅');
			const filter = (reaction, user) => {
				return ['✅'].includes(reaction.emoji.name) && user.id === message.author.id;
			};
			m.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
				.then(() => {
					try {
						m.delete();
						const paypalEmbed = new Discord.MessageEmbed()
							.setColor(embedColor)
							.setAuthor('Setup 2/3 | THIS IS NOT REVERSABLE', footerImg)
							.setDescription('To give you payments, I need your PayPal email address. If you wish to cancel the setup, type `cancel`.')
							.addFields([
								{ name: 'If you have PayPal:', value: 'Type it below, e.g. `cafe.development@gmail.com`' },
								{ name: 'Don\'t have PayPal?', value: 'Instead, you can claim Discord Nitro. Enter `nitro@gmail.com` below.' },
							])
							.setTimestamp()
							.setFooter(footerTxt, footerImg);
						m.channel.send(paypalEmbed).then(msg => msg.delete({ timeout: 45000 }));
						m.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 45000, errors: ['time'] })
							.then(collected => {
								collected.first().delete();
								if (collected.first().content.toLowerCase() == 'cancel') {
									m.channel.send('Cancelled setup.');
									return;
								}
								else {
									setupGuild(m.guild.id, collected.first().content.toLowerCase());
									const finishEmbed = new Discord.MessageEmbed()
										.setColor(embedColor)
										.setAuthor('Setup Complete', footerImg)
										.addFields([
											{ name: 'Make Money:', value: 'Your members can now watch ads by using `ad watch`. The money generated from ads goes to you! Soon, a server leaderboard will be created, so you can reward your members that watch the most ads!' },
											{ name: 'Check Balance:', value: 'Since you are a beta-tester, `$0.1 USD` has been added to your server balance for free! Do `ad balance` to check your server balance.' },
											{ name: 'Made a Typo?', value: 'Visit our support server here: https://discord.gg/k8KgskG' },
										])
										.setTimestamp()
										.setFooter(footerTxt, footerImg);
									m.channel.send(finishEmbed);
									// Here is a complete guide on how you can use the bot:
								}
							});
					}
					catch {
						m.reply('Setup timed-out! Please do `ad setup` again.');
						return;
					}
				})
				.catch(() => {
					m.reply('Setup timed-out. Please do `ad setup` again.');
					return;
				});
		});
	}
	else {
		const setup = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setAuthor(`Set up ${message.guild.name} | AdBot - Make Money from Discord!`, footerImg)
			.setDescription('This guild has already been set up! To check earnings thus far, type: `ad balance`.')
			.addFields([
				{ name: 'PayPal', value: '||' + await getPaypal(message.guild.id) + '||', inline: true },
				{ name: 'Owner', value: message.guild.owner.user.tag, inline: true },
			]);
		message.reply(setup);
	}
};
