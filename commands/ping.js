const { command } = require('../utils')

module.exports = class Ping extends command {
    constructor (name, client) {
        super (name, client)
    }
    async run ({message, args}) {
        var pings = await this.client.shard.broadcastEval('this.ping')
        var dit = args[0] ? parseInt(args[0]) - 1 : 1
        var selected = args[0] ? pings[parseInt(dit)] ? parseInt(dit) : this.client.shard.id : this.client.shard.id
        var ping = pings[selected]
        var pesoCor = ping < 100 ? 65280 : ping < 200 ? 16776960 : 16711680
        var embed = new this.client.Discord.RichEmbed()
            .setTitle(`Shard[${(selected + 1)}/${(this.client.shard.count)}]:`)
            .setDescription(`📡 Ping: **${parseInt(ping)}**ms`)
            .setColor(pesoCor)
        message.channel.send(embed)
    }
}