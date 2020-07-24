module.exports = {
	name: 'watch',
	description: 'Make your members watch ads, earn money!',
	cooldown: 3,
};

module.exports.run = async (client, message, __) => {
	try {
		message.react('📬');
		message.reply('I have sent you a direct message!')
		
		message.author.send(`Watch an ad here: <https://adbot-website.herokuapp.com/watch?c1=${message.author.id}&c2=${message.guild.id}>`)
	} catch (error) {
		message.reply('Please enable your direct messages, so I can DM you.')
		console.log(`wtch1: ${error}`)
	}
};
