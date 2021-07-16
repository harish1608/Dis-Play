const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');

module.exports = {
    name: 'play',
    description: 'Play the song.',
    args: true,
    usage: '<song name>',
    aliases: ['p'],
    async execute(message, args) {

        const queue = message.client.queue;
        const serverQueue = queue.get(message.guild.id);

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel)
            return message.channel.send("No one in voice channel!");
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK"))
            return message.channel.send("Connecting or speaking permissions not provided!");

        const searchResult = await ytsr(args.join(' '), { limit: 1 });
        const firstSongURL = searchResult.items[0].url;
        const songInfo = await ytdl.getInfo(firstSongURL);
        const song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        };

        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };
            queue.set(message.guild.id, queueContruct);
            queueContruct.songs.push(song);

            try {
                let connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(message, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }

        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`\`${song.title}\` added to queue!`);
        }
    },

    async play(message, song) {
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(await ytdl(song.url), { type: 'opus' })
            .on('finish', () => {
                serverQueue.songs.shift();
                this.play(message, serverQueue.songs[0]);
            })
            .on('error', error => console.error(error));

        serverQueue.textChannel.send(`Start playing: \`${song.title}\``);
    }
}