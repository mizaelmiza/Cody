const { command } = require('../utils')

module.exports = class Ban extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['banir']
    }
    async run ({message, args, usuario}) {
        if(!await this.client.verPerm(['BAN_MEMBERS', 'owner', 'subowner', 'operator'], message.member, usuario)) return message.channel.send(t('comandos:ban.noPermission'));
        if(!message.guild.me.hasPermission(['BAN_MEMBERS'])) return message.channel.send(t('comandos:ban.noBotPermBan'));
        if(!args[0]) return message.channel.send(t('comandos:ban.noArgs'));
        var member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : message.guild.members.find(user => user.user.username === args[0]) ? message.guild.members.find(user => user.user.username === args[0]) : message.guild.members.find(user => user.user.tag === args[0]) ? message.guild.members.find(user => user.user.tag === args[0]) : false
        if(!member) return message.channel.send(t('comandos:ban.noArgs'));
        if(message.member.highestRole.position <= member.highestRole.position && message.guild.owner.id !== message.author.id) return message.channel.send(t('comandos:ban.topRole'))
        if(!member.bannable) return message.channel.send(t('comandos:ban.notBannable'));
        var motivo = args[1] ? args.slice(1).join(' ') : t('comandos:ban.notReason')
        await member.ban(motivo)
        message.channel.send(t('comandos:ban.banned', { author: message.member, member: member.user.tag }))
    }
}