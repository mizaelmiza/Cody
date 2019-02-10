const { command } = require('../utils')

module.exports = class Avatar extends command {
    constructor (name, client) {
        super (name, client)
    }
    async run ({message, args}, t) {
        var user = args[0] ? message.mentions.users.first() ? message.mentions.users.first() : this.client.users.get(args.join(' ')) ? this.client.users.get(args.join(' ')) : this.client.users.find(user => user.username === args.join(' ')) ? this.client.users.find(user => user.username === args.join(' ')) : this.client.users.find(user => user.tag === args.join(' ')) ? this.client.users.find(user => user.tag === args.join(' ')) : message.guild.members.find(user => user.displayName === args.join(' ')) ? message.guild.members.find(user => user.displayName === args.join(' ')).user : message.guild.members.find(user => user.displayName.includes(args.join(' '))) ? message.guild.members.find(user => user.displayName.includes(args.join(' '))).user : this.client.users.find(user => user.username.includes(args.join(' '))) ? this.client.users.find(user => user.username.includes(args.join(' '))) : message.author : message.author
        var embed = new this.client.Discord.RichEmbed()
            .setTitle(t('comandos:avatar.title', { user: user.username }))
            .setImage(user.displayAvatarURL)
            .setTimestamp(new Date())
            .setFooter(message.author.username, message.author.displayAvatarURL)
            .setColor(2631906)
        message.channel.send(embed)
    }
}