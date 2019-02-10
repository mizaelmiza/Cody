const { command } = require('../utils')
var inWindow = []

module.exports = class Forms extends command {
    constructor (name, client) {
        super (name, client)
    }
    async run ({message, usuario}) {
        if(!(await this.client.verPerm(['owner', 'subowner', 'operator'], false, usuario))) return message.channel.send(t('comandos:forms.noPermission'));
        if(inWindow.includes(message.author.id)) return message.channel.send(t('comandos:forms.inWindow'))
        var first = await this.client.database.Forms.findOne({})
        if(!first) return message.channel.send(t('comandos:forms.notHaveForms'))
        var genEmbed = async (cnt) => {
            var embed = new this.client.Discord.RichEmbed()
            .setTitle(this.client.users.get(cnt.user) ? `${this.client.users.get(cnt.user).username} (${cnt.role}):` : `${cnt.user} (${cnt.role})`)
            .setDescription(cnt.reason)
            .setThumbnail(this.client.users.get(cnt.user) ? this.client.users.get(cnt.user).displayAvatarURL : 'https://i.imgur.com/b4fhI15.png')
            .setTimestamp(cnt.date)
            .setFooter(message.author.username, message.author.displayAvatarURL)
            .setColor(2631906)
            return embed;
        }
        message.channel.send(await genEmbed(first)).then(async msg => {
            await msg.react('✅')
            await msg.react('❌')
            await msg.react('🖐')
            const aprovar = msg.createReactionCollector((r, u) => r.emoji.name === "✅" && u.id === message.author.id, { time: 120000 });
            const reprovar = msg.createReactionCollector((r, u) => r.emoji.name === "❌" && u.id === message.author.id, { time: 120000 });
            const cancelar = msg.createReactionCollector((r, u) => r.emoji.name === "🖐" && u.id === message.author.id, { time: 120000 });
            var form = await first;
            inWindow.push(message.author.id)
            aprovar.on('collect', async r => {
                r.remove(r.users.last().id).catch(e => {})
                this.client.database.Users.findOne({"_id": form.user}).then(async user => {
                    user.cargos.set(form.role, true)
                    user.save()
                    var mtsg = t('comandos:forms.approved', { member: this.client.users.get(form.user), author: message.member, role: form.role })
                    this.client.shard.broadcastEval(`
                        if(this.guilds.get("507295947789828106")) {
                        this.guilds.get("507295947789828106").channels.get("540740757888172043").send("${mtsg}")
                        }
                    `)
                    form.delete()
                    form = await this.client.database.Forms.findOne({})
                    if(!form) return cancelar.emit('end')
                    msg.edit(await genEmbed(form))
                })
            })
            reprovar.on('collect', async r => {
                r.remove(r.users.last().id).catch(e => {})
                var mtsg2 = await t('comandos:forms.refused', { member: this.client.users.get(form.user), author: message.member, role: form.role })
                this.client.shard.broadcastEval(`
                    if(this.guilds.get("507295947789828106")) {
                    this.guilds.get("507295947789828106").channels.get("540740757888172043").send("${mtsg2}")
                    }
                `)
                form.delete()
                form = await this.client.database.Forms.findOne({})
                if(!form) return cancelar.emit('end')
                msg.edit(await genEmbed(form))
            })
            cancelar.on('collect', async r => {
                inWindow.splice(inWindow.indexOf(message.author.id), 1)
                msg.delete().catch(e => {})
                aprovar.emit('end')
                reprovar.emit('end')
                cancelar.emit('end')
            })
            cancelar.on('end', async r => {
                inWindow.splice(inWindow.indexOf(message.author.id), 1)
                msg.delete().catch(e => {})
                aprovar.emit('end')
                reprovar.emit('end')
            })
        })
    }
}