module.exports = async function (guild) {
    this.database.Guilds.deleteOne({'_id': guild.id})
}