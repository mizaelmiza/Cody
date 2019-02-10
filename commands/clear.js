const { command } = require('../utils')

module.exports = class Clear extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['limpar']
    }
    async run ({message, args, usuario}) {
        if(!(await this.client.verPerm(['MANAGE_MESSAGES', 'owner', 'subowner', 'operator'], message.member, usuario))) return message.channel.send(t('comandos:botconfig.noPermission'));
        if(!message.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES')) return message.channel.send(t('comandos:clear.noPerm'));
        if(!args[0]) return message.channel.send(t('comandos:clear.noArgs'));
        if(!Number(args[0])) return message.channel.send(t('comandos:clear.notNumber', { nan: args[0] }));
        var quantidade = parseInt(args[0])
        if(quantidade <= 0) return message.channel.send(t('comandos:clear.number0', { count: quantidade }));
        if(quantidade > 100) return message.channel.send(t('comandos:clear.more100', { number: quantidade }));
        await message.delete()
        message.channel.bulkDelete(quantidade)
        message.channel.send(t('comandos:clear.cleared', { count: quantidade, member: message.author.username })).then(msg => {
            setTimeout(() => {
                msg.delete()
            }, 5 * 1000)
        })
    }
}