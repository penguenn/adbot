const { embedColor, footerImg, footerTxt } = require('../config.js');
const Discord = require('discord.js');

module.exports = {
	name: 'premium',
	description: 'Purchase a premium version of AdBot.',
	aliases: ['donate'],
	cooldown: 3,
};

module.exports.run = async (_, message, __) => {
	try {
		const helpEmbed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setAuthor('Support our Development', footerImg)
			.addFields(
				{ name: 'Purchase AdBot Premium', value: 'Get 2x Revenue from all ads watched in your Discord server. [Purchase here.](https://bmc.xyz/l/adbot) -- the bot is still in Beta Testing, so your perks from donating may not be added for the time-being.' },
				{ name: '<:cash:729800059952037909> Donate', value: 'We spend our funds on hosting our bot, and improving it. Consider supporting us. [Donate here!](https://www.buymeacoffee.com/youtube)' },
			)
			.setTimestamp()
			.setFooter(footerTxt, footerImg);
		message.channel.send(helpEmbed);
	}
	catch (err) {
		message.reply('Please give me the `EMBED LINKS` permission.');
		console.error(`PRM0: ${err}`);
	}
};
