const { command } = require('../utils')

module.exports = class Kick extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['expulsar']
    }
    async run ({message, args, usuario}) {
        if(!await this.client.verPerm(['KICK_MEMBERS', 'owner', 'subowner', 'operator'], message.member, usuario)) return message.channel.send(t('comandos:kick.noPermission'));
        if(!message.guild.me.hasPermission(['KICK_MEMBERS'])) return message.channel.send(t('comandos:kick.noBotPermKick'));
        if(!args[0]) return message.channel.send(t('comandos:kick.noArgs'));
        var member = message.mentions.members.first() ? message.mentions.members.first() : message.guild.members.get(args[0]) ? message.guild.members.get(args[0]) : message.guild.members.find(user => user.user.username === args[0]) ? message.guild.members.find(user => user.user.username === args[0]) : message.guild.members.find(user => user.user.tag === args[0]) ? message.guild.members.find(user => user.user.tag === args[0]) : false
        if(!member) return message.channel.send(t('comandos:kick.noArgs'));
        if(message.member.highestRole.position <= member.highestRole.position && message.guild.owner.id !== message.author.id) return message.channel.send(t('comandos:ban.topRole'))
        if(!member.kickable) return message.channel.send(t('comandos:kick.notKickable'));
        var motivo = args[1] ? args.slice(1).join(' ') : t('comandos:kick.notReason')
        await member.kick(motivo)
        message.channel.send(t('comandos:kick.kicked', { author: message.member, member: member.user.tag }))
    }
}