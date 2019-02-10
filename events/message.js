var roleSetDelay = new Set()
module.exports = async function (message) {
    if (message.channel.type === 'dm') return;
    if (message.author.bot) return;
    let args = message.content.split(' ').slice(1)
    const setFixedT = function(translate) {
        t = translate
    }

    var usuario = await this.database.Users.findOne({'_id': message.author.id})
    var servidor = await this.database.Guilds.findOne({'_id': message.guild.id})

    if(usuario && servidor) {
        const language = (servidor && servidor.lang) || 'pt-BR'
        setFixedT(this.i18next.getFixedT(language))
        return new Promise(async (resolve, reject) => {
    
            this.i18next.use(this.translationBackend).init({
                ns: ['comandos', 'eventos', 'help'],
                preload: await this.fs.readdirSync('./locales'),
                fallbackLng: 'pt-BR',
                backend: {
                    loadPath: `./locales/{{lng}}/{{ns}}.json`
                },
                interpolation: {
                    escapeValue: false
                },
                returnEmptyString: false
            }, (e, f) => {
                if (f) {
                    if(!usuario.banned.get('ban')) {
                        if (message.content.startsWith(servidor.prefix)) {
                            if(message.content === servidor.prefix) return;
                            var command = message.content.split(' ')[0].slice(servidor.prefix.length)
                            try {
                                var prefix = servidor.prefix
                                var tempoPassado = Date.now() - parseInt(usuario.cmdcoldown)
                                var tempoRestante = (parseInt(usuario.cmdcoldown) + 3000) - (tempoPassado + parseInt(usuario.cmdcoldown))
                                var segundos = parseInt(tempoRestante/1000)
                                var milesimos = tempoRestante - (segundos*1000)
                                if (tempoPassado < 3000) return message.channel.send(t('eventos:cmdCooldown', { member: message.member, seconds: segundos, thousandth: milesimos }));
                                usuario.cmdcoldown = Date.now()
                                usuario.save();
                                var commandRun = this.commands.find(c => c.name === command || c.aliases.includes(command))
                                if (commandRun) {
                                this.database.Commands.findOne({'_id': commandRun.name}).then(async cmdDB => {
                                        if(cmdDB) {
                                            if(cmdDB.maintenance && !(await this.verPerm(['owner', 'subowner', 'developer', 'supervisor', 'designer'], false, usuario))) return message.channel.send(t('eventos:cmdInManu', { cmd: command }))
                                            commandRun.process({message, args, prefix, usuario, servidor}, t, setFixedT)
                                        } else {
                                            this.newDocDB({ id: commandRun.name, type: 3 })
                                            message.channel.send(t('eventos:noCmdDB', { cmd: command }))
                                        }
                                    })
                                }
                            } catch (err) {
                                if (err.code === 'MODULE_NOT_FOUND') return;
                                console.log(err.code)
                                console.error(err)
                            }
                        }
    
    
                        if(message.guild.id === '507295947789828106' && this.user.id !== '539671041409024000') {
                            if(roleSetDelay.has(message.author.id)) return;
                            setTimeout(() => {
                                roleSetDelay.delete(message.author.id)
                            }, 20 * 1000)
                            var roles = [{
                                name: 'operator',
                                roleID: '540659452874063873'
                            }, {
                                name: 'developer',
                                roleID: '509880066071855122'
                            }, {
                                name: 'supervisor',
                                roleID: '510230403609788430'
                            }, {
                                name: 'designer',
                                roleID: '534427791865675799'
                            }]
                            this.database.Users.findOne({'_id': message.author.id}).then(user => {
                                roles.forEach(role => {
                                    if(user.cargos.get(role.name)) {
                                        message.member.addRole(role.roleID)
                                    } else if(message.member.roles.get(role.roleID)) {
                                        message.member.removeRole(role.roleID)
                                    }
                                })
                            })
                        }
                    } else {
                        if(!usuario.banned.get('tempban')) return;
                        if(Date.now() >= parseInt(usuario.banned.get('time'))) {
                            usuario.banned.set('ban', false)
                            usuario.banned.set('tempban', false)
                            usuario.banned.set('time', 0)
                            usuario.save()
                            message.channel.send(t('eventos:unbanned', { member: message.member }))
                        }
                    }
                }
            })
        })
    } else {
        if (!servidor) {
            this.newDocDB({
                id: message.guild.id,
                type: 2,
                content: message.guild
            })
        }
        if (!usuario) {
            this.newDocDB({
                id: message.author.id,
                type: 1,
                content: message.author
            })
        }
    }
}