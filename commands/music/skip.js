module.exports = {
	name: 'skip',
	description: 'Skip a song!',
	execute(message) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel)
			return message.channel.send('You have to be in a voice channel to skip the song!');
		if (!serverQueue)
			return message.channel.send('There is no song to skip!');
		serverQueue.connection.dispatcher.end();
	},
};