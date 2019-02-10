const { command } = require('../utils')

module.exports = class BotConfig extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['bconfig']
    }
    async run ({message, args, usuario, prefix}) {
        if(!(await this.client.verPerm(['owner', 'subowner', 'developer', 'operator'], false, usuario))) return message.channel.send(t('comandos:botconfig.noPermission'));
        var invalid = new this.client.Discord.RichEmbed()
            .addField(t('comandos:botconfig.howToUse'), `\`\`\`\n${prefix}botconfig cmd <manu> <command-name>\`\`\``, false)
            .setColor(2631906)
        var funcao = args[0]
        if(!funcao) return message.channel.send(invalid)
        funcao = funcao.toLowerCase()
        if(funcao === 'cmd') {
            funcao = args[1]
            if(!funcao) return message.channel.send(invalid)
            funcao = funcao.toLowerCase()
            if(funcao === 'manu') {
                var cmd = args[2]
                if(!cmd) return message.channel.send(t('comandos:botconfig.noCmdManu'))
                cmd = args[2].toLowerCase()
                this.client.database.Commands.findOne({'_id': cmd}).then(cmdDB => {
                    if(!cmdDB) return message.channel.send(t('comandos:botconfig.cmdNotExist'))
                    if(!cmdDB.maintenance) { message.channel.send(t('comandos:botconfig.activated', { cmd: cmd })) } else { message.channel.send(t('comandos:botconfig.disabled', { cmd: cmd })) }
                    cmdDB.maintenance = cmdDB.maintenance ? false : true
                    cmdDB.save()
                })
            } else {
                message.channel.send(t('comandos:botconfig.invalidFunc', { func: funcao }));
            }
        } else {
            message.channel.send(t('comandos:botconfig.invalidFunc', { func: funcao }));
        }
    }
}