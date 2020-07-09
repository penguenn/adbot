module.exports = {
	name: 'serverslist',
	description: 'Lists all servers.',
	dev: true,
	cooldown: 3,
};

module.exports.run = (client, message, _) => {
	const promises = [
		client.shard.fetchClientValues('guilds.cache.size'),
		client.shard.broadcastEval(`
let count = [];
count.push(client.shard.broadcastEval('this.guilds.cache.each(guild => count.push(guild.memberCount))'))
        `),
	];
	Promise.all(promises)
		.then(results => {
			const totalGuilds = results[0].reduce((prev, guildCount) => prev + guildCount, 0);
			const totalMembers = results[1].reduce((prev, memberCount) => prev + memberCount, 0);
			return message.channel.send('Guilds: `' + totalGuilds + '`, Members: `' + totalMembers + '`.');
		})
		.catch(console.error);

	const guilds = client.guilds.cache.map(guild => guild)
		.sort((a, b) => b.memberCount - a.memberCount);

	const output = guilds.map(guild => `${guild.name}: ${guild.memberCount}: ${guild.id}`)
		.join('\n');

	message.channel.send(output, { split: true });

	const userCount = guilds.map(guild => guild.memberCount).reduce((a, b) => { return a + b; }, 0);
	const guildCount = guilds.length;

	message.channel.send('Guilds: `' + guildCount + '`, Users: `' + userCount + '`');
};
