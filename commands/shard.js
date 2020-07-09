module.exports = {
	name: 'shard',
	description: 'Manage shards.',
	dev: true,
	usage: '[ids | respawn | kill | restart]',
};

module.exports.run = async (client, message, args) => {
	if (args[0] === 'ids') {
		message.reply(`Total Shards: ${client.shard.count}`);
		message.reply(`All my shards: ${client.shard.ids.toString()}`);
		return;
	}
	if (args[0] === 'respawn') {
		message.reply('<a:loading:714010263577428010> Respawning all shards...');
		client.shard.respawnAll();
		return;
	}
	if (args[0] === 'kill') {
		const id = message.guild.shardID;
		message.reply(`<a:loading:714010263577428010> This guild's shard, ${id}, was killed.`);
		client.shard.broadcastEval(`if (this.shard.id === ${id}) this.shard.respawn();`);
		return;
	}
	if (args[0] === 'restart') {
		message.reply('<a:loading:714010263577428010> Killing all processes, and restarting.');
		client.shard.broadcastEval('process.exit();');
		return;
	}
	message.reply('Commands: `ids`, `respawn`, `kill`, `restart`');
};
