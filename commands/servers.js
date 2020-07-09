module.exports = {
	name: 'servers',
	description: 'Fetches servers & users.',
	dev: true,
	cooldown: 3,
};

module.exports.run = async (client, message, _) => {
	const promises = [
		client.shard.fetchClientValues('guilds.cache.size'),
		client.shard.broadcastEval('this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)'),
	];
	Promise.all(promises)
		.then(results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
			return message.channel.send('Guilds: `' + totalGuilds + '`, Members: `' + totalMembers + '`.');
		})
		.catch(console.error);
};
