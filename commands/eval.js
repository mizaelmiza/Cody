const { command } = require('../utils')

module.exports = class Eval extends command {
    constructor (name, client) {
        super (name, client)
        this.aliases = ['e']
    }
    async run ({message, args, usuario, servidor}, t) {
        if(!(await this.client.verPerm(['owner', 'subowner', 'operator', 'developer'], false, usuario))) return message.channel.send(t('comandos:eval.noPermission'));
        if((await this.client.verPerm(['developer'], false, usuario)) && !(await this.client.verPerm(['owner', 'subowner', 'operator'], false, usuario)) && message.guild.id !== '507295947789828106') return message.channel.send(t('comandos:eval.noThisServer'))
        var code = args.join(' ')
        if(!code) return message.channel.send(t('comandos:eval.noCode'));
        if(code.includes('token')) return;
        var embed = new this.client.Discord.RichEmbed()
            .setThumbnail('https://i.imgur.com/b4fhI15.png')
            .setTimestamp(new Date())
            .setFooter(message.author.username, message.author.displayAvatarURL)
        try {
            var resultado = await eval(code)
            embed.addField(t('comandos:eval.code'), `\`\`\`${code}\`\`\``, false)
            embed.addField(t('comandos:eval.result'), `\`\`\`${resultado}\`\`\``, false)
            embed.setColor(2631906)
            message.channel.send(embed)
        } catch(err) {
            embed.addField(t('comandos:eval.code'), `\`\`\`${code}\`\`\``, false)
            embed.addField(t('comandos:eval.error'), `\`\`\`${err}\`\`\``, false)
            embed.setColor(16711680)
            message.channel.send(embed)
        }
    }
}