module.exports = {
	name: 'claim',
	description: 'Claim the revenue from the ads watched!',
	admin: true,
	cooldown: 3,
};

module.exports.run = async (client, message, args) => {
	message.reply('This command is under testing. It will be released in a few days.');
};