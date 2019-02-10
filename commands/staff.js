const { command } = require('../utils')
var inWindow = []

module.exports = class Staff extends command {
    constructor (name, client) {
        super (name, client)
    }
    async run ({message, args, usuario, prefix}, t) {
        if(args[0] && args[0].toLowerCase() === 'form') {
            if(inWindow.includes(message.author.id)) return message.channel.send(t('comandos:staff.inWindow'))
            inWindow.push(message.author.id)
            var embed = new this.client.Discord.RichEmbed()
            .setTitle(t('comandos:staff.formTitle'))
            .setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.notHaveErrors') }))
            .setThumbnail('https://i.imgur.com/b4fhI15.png')
            .setFooter(message.author.username, message.author.displayAvatarURL)
            .setColor(2631906)
            message.channel.send(embed).then(async msg => {
                try {
                    await msg.react('1⃣')
                    await msg.react('2⃣')
                    await msg.react('3⃣')
                    await msg.react('❌')
                    const desenvolvedor = msg.createReactionCollector((r, u) => r.emoji.name === "1⃣" && u.id === message.author.id, { time: 60000 });
                    const supervisor = msg.createReactionCollector((r, u) => r.emoji.name === "2⃣" && u.id === message.author.id, { time: 60000 });
                    const finalizar = msg.createReactionCollector((r, u) => r.emoji.name === "❌" && u.id === message.author.id, { time: 60000 });
                    const designer = msg.createReactionCollector((r, u) => r.emoji.name === "3⃣" && u.id === message.author.id, { time: 60000 });
                    var role = 'None'
                    var force = false
                    var completed = false
                    var fim = false
                    this.client.database.Forms.find({'user': message.author.id}).then(async formDB => {
                        var roles = []
                        await formDB.forEach(role => { roles.push(role.role) })
                        desenvolvedor.on('collect', async r => {
                            r.remove(r.users.last().id).catch(e => {})
                            if(roles.includes('developer')) {
                                embed.setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.formAlreadySubmitted') }))
                                msg.edit(embed)
                            } else if(usuario.cargos.get('developer')) {
                                embed.setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.alreadyHaveRole') }))
                                msg.edit(embed)
                            } else {
                                role = 'developer'
                                force = true
                                desenvolvedor.emit('end')
                                supervisor.emit('end')
                                designer.emit('end')
                                finalizar.emit('end')
                            }
                        })
                        supervisor.on('collect', async r => {
                            r.remove(r.users.last().id).catch(e => {})
                            if(roles.includes('supervisor')) {
                                embed.setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.formAlreadySubmitted') }))
                                msg.edit(embed)
                            } else if(usuario.cargos.get('supervisor')) {
                                embed.setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.alreadyHaveRole') }))
                                msg.edit(embed)
                            } else {
                                role = 'supervisor'
                                force = true
                                desenvolvedor.emit('end')
                                supervisor.emit('end')
                                designer.emit('end')
                                finalizar.emit('end')
                            }
                        })
                        designer.on('collect', async r => {
                            r.remove(r.users.last().id).catch(e => {})
                            if(roles.includes('designer')) {
                                embed.setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.formAlreadySubmitted') }))
                                msg.edit(embed)
                            } else if(usuario.cargos.get('designer')) {
                                embed.setDescription(t('comandos:staff.formDesc', { error: t('comandos:staff.alreadyHaveRole') }))
                                msg.edit(embed)
                            } else {
                                role = 'designer'
                                force = true
                                desenvolvedor.emit('end')
                                supervisor.emit('end')
                                designer.emit('end')
                                finalizar.emit('end')
                            }
                        })
                        finalizar.on('collect', async r => {
                            fim = true
                            msg.delete()
                            inWindow.splice(inWindow.indexOf(message.author.id), 1)
                            desenvolvedor.emit('end')
                            supervisor.emit('end')
                            designer.emit('end')
                            finalizar.emit('end')
                        })
                        designer.on('end', async r => {
                            if(fim) return;
                            if(!force) {
                                msg.delete().catch(e => {})
                                message.channel.send(t('comandos:staff.timesUp', { member: message.member }))
                                inWindow.splice(inWindow.indexOf(message.author.id), 1)
                            } else {
                                if(completed) return;
                                msg.delete().catch(e => {})
                                message.channel.send(t('comandos:staff.reasonForRole', { member: message.member, role: role })).then(async veDM => {
                                    completed = true
                                    message.channel.awaitMessages(mensagem => mensagem.author.id === message.author.id, {
                                        maxMatches: 1,
                                        time: 60000,
                                        errors: ['time']
                                    }).then((coletado) => {
                                        veDM.delete().catch(e => {})
                                        if(coletado.first().content !== 'cancel') {
                                            message.channel.send(t('comandos:staff.thankYou', { member: message.member })).then(async thanks => {
                                                this.client.newDocDB({
                                                    id: message.author.id + role,
                                                    type: 4,
                                                    user: message.author.id,
                                                    role: role,
                                                    reason: coletado.first().content
                                                })
                                                inWindow.splice(inWindow.indexOf(message.author.id), 1)
                                                var mtsg = t('comandos:staff.submited', { member: message.author.tag, role: role })
                                                this.client.shard.broadcastEval(`
                                                    if(this.guilds.get("507295947789828106")) {
                                                    this.guilds.get("507295947789828106").channels.get("540740757888172043").send("${mtsg}")
                                                    }
                                                `)
                                            })
                                        } else {
                                            inWindow.splice(inWindow.indexOf(message.author.id), 1)
                                            message.channel.send(t('comandos:staff.canceled', { member: message.member }))
                                        }
                                    }, function () {
                                        veDM.delete().catch(e => {})
                                        message.channel.send(t('comandos:staff.timesUpReason', { member: message.member }))
                                        inWindow.splice(inWindow.indexOf(message.author.id), 1)
                                    })
                                }).catch(e => {})
                            }
                        })
                    })
                } catch(e) {
                    console.log(e)
                }
            })
        } else {
            var minutos = parseInt(((Date.now() - this.client.dataStaff.lastUpdate)/1000)/60)
            var owners = this.client.dataStaff.owner.map(user => this.client.users.get(user) ? `**${this.client.users.get(user).tag}**` : t('comandos:staff.userNotFound'))
            var subowners = this.client.dataStaff.subowner.map(user => this.client.users.get(user) ? `**${this.client.users.get(user).tag}**` : t('comandos:staff.userNotFound'))
            var operators = this.client.dataStaff.operator.map(user => this.client.users.get(user) ? `**${this.client.users.get(user).tag}**` : t('comandos:staff.userNotFound'))
            var developers = this.client.dataStaff.developer.map(user => this.client.users.get(user) ? `**${this.client.users.get(user).tag}**` : t('comandos:staff.userNotFound'))
            var supervisors = this.client.dataStaff.supervisor.map(user => this.client.users.get(user) ? `**${this.client.users.get(user).tag}**` : t('comandos:staff.userNotFound'))
            var designers = this.client.dataStaff.designer.map(user => this.client.users.get(user) ? `**${this.client.users.get(user).tag}**` : t('comandos:staff.userNotFound'))
            var embed = new this.client.Discord.RichEmbed()
                .setTitle(t('comandos:staff.title'))
                .setDescription(t('comandos:staff.desc', {prefix: prefix}))
                .addField(t('comandos:staff.owners'), owners.join(', '))
                .addField(t('comandos:staff.subowners'), subowners.join(', '))
                .addField(t('comandos:staff.operators'), operators.join(', '))
                .addField(t('comandos:staff.developers'), developers.join(', '))
                .addField(t('comandos:staff.supervisors'), supervisors.join(', '))
                .addField(t('comandos:staff.designers'), designers.join(', '))
                .setThumbnail('https://i.imgur.com/b4fhI15.png')
                .setFooter(t('comandos:staff.footer', { lastUpdate: minutos }))
                .setColor(2631906)
            message.channel.send(embed)
        }
    }
}