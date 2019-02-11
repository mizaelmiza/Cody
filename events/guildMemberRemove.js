module.exports = async function (member) {
    this.database.Guilds.findOne({'_id': member.guild.id}).then(servidor => {
        if(!servidor) return;
        if(servidor.concierge.get('byebye').on) {
            var ath = servidor.concierge.get('byebye')
            var mensagem = ath.message.replace('{member}', member).replace('{user.name}', member.user.username).replace('{user.id}', member.user.id).replace('{guild}', member.guild.name)
            member.guild.channels.get(ath.channel).send(mensagem).catch(err => {
                ath.on = false
                ath.message = 'None'
                ath.channel = 'None'
                servidor.save()
            })
        }
        if(member.guild.id === '507295947789828106' && this.user.id !== '539671041409024000') {
            var roles = ['owner', 'subowner', 'operator', 'developer', 'supervisor', 'designer']
            this.database.Users.findOne({'_id': member.user.id}).then(user => {
                if(!user) return;
                roles.forEach(role => {
                    if(user.cargos.get(role)) {
                        user.cargos.set(role, false)
                    }
                })
            })
        }
    })
}