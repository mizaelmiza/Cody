const { command } = require('../utils')

module.exports = class Autorole extends command {
    constructor (name, client) {
        super (name, client)
    }
    async run ({message, args, servidor, usuario, prefix}, t) {
        if(!(await this.client.verPerm(['MANAGE_ROLES_OR_PERMISSIONS', 'owner', 'subowner', 'operator'], message.member, usuario))) return message.channel.send(t('comandos:autorole.noPermission'));
        var invalid = new this.client.Discord.RichEmbed()
            .addField(t('comandos:autorole.howToUse'), `\`\`\`${prefix}autorole <add/del> <role-mention/role-id/role-name>\`\`\``)
            .addField(t('comandos:autorole.definedRoles'), `${servidor.autorole.get('idRoles').length > 0 ? `<@&${servidor.autorole.get('idRoles').join('> **|** <@&')}>` : t('comandos:autorole.none')}`)
            .setTimestamp(new Date())
            .setFooter(message.author.username, message.author.displayAvatarURL)
            .setColor(2631906)
        if(!args[0]) return message.channel.send(invalid);
        var funcao = args[0].toLowerCase()
        if(funcao !== 'add' && funcao !== 'del') return message.channel.send(t('comandos:autorole.invalidFunction', { function: funcao }));
        if(funcao === 'add' && servidor.autorole.get('idRoles').length === 5) return message.channel.send(t('comandos:autorole.limitRoles'));
        if(funcao === 'del' && servidor.autorole.get('idRoles').length === 0) return message.channel.send(t('comandos:autorole.noDefinedRoles'));
        if(!args[1]) return message.channel.send(t('comandos:autorole.noMentionRole'));
        var role = message.mentions.roles.first() ? message.mentions.roles.first() : message.guild.roles.get(args[1]) ? message.guild.roles.get(args[1]) : message.guild.roles.find(re => re.name === args.splice(1).join(' ')) ? message.guild.roles.find(re => re.name === args.splice(1).join(' ')) : false
        if(!role) return message.channel.send(t('comandos:autorole.invalidRole'));
        if(funcao === 'add' && servidor.autorole.get('idRoles').includes(role.id)) return message.channel.send(t('comandos:autorole.alreadyDefined'));
        if(funcao === 'del' && !servidor.autorole.get('idRoles').includes(role.id)) return message.channel.send(t('comandos:autorole.roleNotDefined'));
        if(message.member.highestRole.position <= role.position && message.guild.owner.id !== message.author.id) return message.channel.send(t('comandos:autorole.noPermRole'));
        if(message.guild.me.highestRole.position <= role.position || !message.guild.me.hasPermission(['MANAGE_ROLES_OR_PERMISSIONS'])) return message.channel.send(t('comandos:autorole.noPermRoleBot'));
        if(funcao === 'add') {
            if(!servidor.autorole.get('on')) {
                servidor.autorole.set('on', true)
            }
            servidor.autorole.get('idRoles').push(role.id)
            servidor.save()
            message.channel.send(t('comandos:autorole.addedRole', { role: role.name }))
        } else if(funcao === 'del') {
            if(servidor.autorole.get('on') && servidor.autorole.get('idRoles').length - 1 === 0) {
                servidor.autorole.set('on', false)
            }
            servidor.autorole.get('idRoles').splice(servidor.autorole.get('idRoles').indexOf(role.id), 1)
            servidor.save()
            message.channel.send(t('comandos:autorole.removedRole', { role: role.name }))
        }
    }
}