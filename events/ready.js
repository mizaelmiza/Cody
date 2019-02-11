module.exports = async function () {
    setTimeout(async () => {
        this.shardLog(`${this.user.tag} iniciado`)
        this.setGame({random: true, force: true})
        this.dbl.postStats(this.guilds.size, this.shards.Id, this.shards.total);
        setInterval(() => {
            this.dbl.postStats(client.guilds.size, client.shards.Id, client.shards.total);
        }, 1800000);
        setInterval(async () => {
            this.setGame({random: true, force: false})
        }, 5 * 1000 * 60)
        this.setDataStaff()
        setInterval(() => {
            this.setDataStaff()
        }, 15 * 1000 * 60)
    },10 * 1000)
}