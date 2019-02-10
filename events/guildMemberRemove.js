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
    })
}