const { command } = require('../utils')

module.exports = class Info extends command {
    constructor (name, client) {
        super (name, client)
    }
    async run ({message, args}) {
            var links = [{
                name: 'convite',
                link: `https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=2146958847`
            }, {
                name: 'servidor',
                link: 'https://discord.gg/5Xt3uHF'
            }, {
                name: 'discord bot list',
                link: 'https://discordbots.org/bot/507292506942210048'
            }]
            var guildsSize = await this.client.guildsAlt.size()
            var channelsSize = await this.client.channelsAlt.size()
            var usersSize = await this.client.usersAlt.size()
            var embed = new this.client.Discord.RichEmbed()
                .setTitle(t('comandos:info.title'))
                .setDescription(t('comandos:info.description', { myFounder: this.client.users.get('337410863545843714').tag }))
                .addField(t('comandos:info.statistics'), t('comandos:info.statisticsDesc', { ping: parseInt(this.client.ping), memory: (process.memoryUsage().heapUsed / 1024 / 1024).toString().slice(0,4), votes: 0 }), true)
                .addField(t('comandos:info.community'), t('comandos:info.communityDesc', { guilds: guildsSize, channels: channelsSize, users:  usersSize }), true)
                .addField(t('comandos:info.uptime'), "0", true)
                .addField(t('comandos:info.urls'), links.map(link => link ? `- **[${link.name.toUpperCase()}](${link.link})**` : '- __**EM BREVE**__').join('\n'), true)
                .setThumbnail('https://i.imgur.com/b4fhI15.png')
                .setTimestamp(new Date())
                .setFooter(message.author.username, message.author.displayAvatarURL)
                .setColor(2631906)
            message.channel.send(t('comandos:info.cntMessage'), embed)
    }
}