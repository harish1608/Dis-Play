module.exports = {
	name: 'resume',
	description: 'Resume the song!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		serverQueue.connection.dispatcher.resume();
	},
};