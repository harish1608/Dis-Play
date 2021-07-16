module.exports = {
    name: 'queue',
    description: 'Displays the queue!',
    aliases: ['list', 'q'],
    execute(message) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue)
            return message.channel.send('There is no song in the queue!');

        let songsList = [];
        let i = 1;
        for (const song of serverQueue.songs) {
            songsList.push(`${i}: \`${song.title}\``);
            i++;
        }
        message.channel.send(songsList);
    },
};