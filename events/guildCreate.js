module.exports = async function (guild) {
    this.database.Guilds.findOne({"_id": guild.id}).then(servidor => {
        if(!servidor) return this.newDocDB({ id: guild.id, type: 2, content: guild })
    })
}