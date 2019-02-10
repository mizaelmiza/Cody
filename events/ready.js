module.exports = async function () {
    this.shardLog(`${this.user.tag} iniciado`)
    this.setDataStaff()
    setInterval(() => {
        this.setDataStaff()
    }, 15 * 1000 * 60)
}