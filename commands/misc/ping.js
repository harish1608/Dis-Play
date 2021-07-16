module.exports = {
	name: 'ping',
	description: 'Emits a Pong!',
	execute(message) {
		message.channel.send('Pong.');
	},
};