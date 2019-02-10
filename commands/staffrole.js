const { command } = require('../utils')

module.exports = class StaffRole extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['srole']
    }
    async run ({message, args, prefix, usuario}, t) {
        if(!(await this.client.verPerm(['owner', 'subowner', 'operator', 'developer'], false, usuario))) return message.channel.send(t('comandos:staffrole.noPermission'));
        var cargosA = ['owner', 'subowner', 'operator', 'developer', 'supervisor', 'designer']
        var cargosB = {
            'owner': { name: 'owner', content: usuario.cargos.get('owner'), permission: 5 },
            'subowner': { name: 'subwoner', content: usuario.cargos.get('subowner'), permission: 4 },
            'operator': { name: 'operator', content: usuario.cargos.get('operator'), permission: 3 },
            'developer': { name: 'developer', content: usuario.cargos.get('developer'), permission: 2 },
            'supervisor': { name: 'supervisor', content: usuario.cargos.get('supervisor'), permission: 1 },
            'designer': { name: 'designer', content: usuario.cargos.get('designer'), permission: 1 }
        }
        var authorPerm = 0
        cargosA.forEach(role => { if(cargosB[role].content) { if(authorPerm < cargosB[role].permission) { authorPerm = cargosB[role].permission } } })
        var invalid = new this.client.Discord.RichEmbed()
            .addField(t('comandos:staffrole.howToUse'), `\`\`\`\n${prefix}staffrole <add/del> <role-name> <user-mention>\`\`\``, false)
            .addField(t('comandos:staffrole.roles'), `\`${cargosA.join('` **|** `')}\``)
            .setColor(2631906)
        if(!args[2]) return message.channel.send(invalid);
        if(args[0].toLowerCase() !== 'add' && args[0].toLowerCase() !== 'del') return message.channel.send(t('comandos:staffrole.invalidFunction', { function: args[0].toLowerCase() }));
        if(!cargosA.includes(args[1].toLowerCase())) return message.channel.send(t('comandos:staffrole.roleNotExist', { role: args[1].toLowerCase(), roles: cargosA.join('` **|** `') }));
        if(!message.mentions.users.first()) return message.channel.send(t('comandos:staffrole.noMention'));
        var funcao = args[0].toLowerCase()
        var cargo = args[1].toLowerCase()
        var usuarioMencionado = message.mentions.users.first()
        if(usuarioMencionado.bot) return message.channel.send(t('comandos:staffrole.mentionBot'))
        if(cargosB[cargo].permission >= authorPerm && message.author.id !== '337410863545843714') return message.channel.send(t('comandos:staffrole.noRolePermission'));
        this.client.database.Users.findOne({'_id': usuarioMencionado.id}).then(mencionadoDB => {
            if(mencionadoDB) {
                if(funcao === 'add' && mencionadoDB.cargos.get(cargo)) return message.channel.send(t('comandos:staffrole.alreadyHaveRole'));
                if(funcao === 'del' && !mencionadoDB.cargos.get(cargo)) return message.channel.send(t('comandos:staffrole.roleNotFound'));
                if(funcao === 'add') { mencionadoDB.cargos.set(cargo, true); message.channel.send(t('comandos:staffrole.added', { role: cargo })) } else if(funcao === 'del') { mencionadoDB.cargos.set(cargo, false); message.channel.send(t('comandos:staffrole.removed', { role: cargo })) }
                mencionadoDB.save();
            } else {
                message.channel.send(t('comandos:staffrole.noUserDB'));
                this.client.newDocDB({
                    id: usuarioMencionado.id,
                    type: 1,
                    content: usuarioMencionado
                })
            }
        })
    }
}