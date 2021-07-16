module.exports = {
	name: 'pause',
	description: 'Pause the song!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		serverQueue.connection.dispatcher.pause();
	},
};