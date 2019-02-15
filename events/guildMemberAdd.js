module.exports = async function (member) {
    this.database.Guilds.findOne({'_id': member.guild.id}).then(servidor => {
        if(!servidor) return;
        if(servidor.muteds.includes(member.id)) {
            var role = await member.guild.roles.find(role => role.name === '🔇Cody Mute')
            if(role) {
                member.addRole(role.id)
            } else {
                servidor.muteds.splice(servidor.muteds.indexOf(member.id), 1)
                servidor.save()
            }
        }
        if(servidor.autorole.get('on')) {
            servidor.autorole.get('idRoles').forEach(async roleID => {
                if(member.guild.roles.get(roleID)) {
                    member.addRole(roleID).catch(err => {
                        servidor.autorole.get('idRoles').splice(servidor.autorole.get('idRoles').indexOf(roleID), 1);
                        if(servidor.autorole.get('on') && servidor.autorole.get('idRoles').length === 0) {
                            sservidor.autorole.set('on', false)
                        }    
                        servidor.save()
                    })
                } else {
                    servidor.autorole.get('idRoles').splice(servidor.autorole.get('idRoles').indexOf(roleID), 1);
                    servidor.save()
                }
            })
        }
        if(servidor.concierge.get('welcome').on) {
            var ath = servidor.concierge.get('welcome')
            var mensagem = ath.message.replace('{member}', member).replace('{user.name}', member.user.username).replace('{user.id}', member.user.id).replace('{guild}', member.guild.name)
            member.guild.channels.get(ath.channel).send(mensagem).catch(err => {
                ath.on = false
                ath.message = 'None'
                ath.channel = 'None'
                servidor.save()
            })
        }
    })
    if(member.guild.id === '507295947789828106' && this.user.id !== '539671041409024000') {
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
        this.database.Users.findOne({'_id': member.user.id}).then(user => {
            if(!user) return;
            roles.forEach(role => {
                if(user.cargos.get(role.name)) {
                    member.addRole(role.roleID)
                }
            })
            if(user.vip) {
                member.addRole('544580493866434560')
            }
        })
    }
}