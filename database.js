const Cody = require('./Cody')
const client = new Cody()
var mongoose = require('mongoose')
var Schema = mongoose.Schema
mongoose.connect(process.env.database, { useNewUrlParser: true }, (err) => {
  if (err) return console.log(`Shard ${client.shard.id + 1}: Erro ao conectar no database!\n${err}`)
  console.log(`Shard ${client.shard.id + 1}: Conectado ao BANCO DE DADOS!`)
})

var User = new Schema({
  _id: {
    type: String
  },
  banned: {
    type: Map,
    default: { ban: false, tempban: false, time: 0 }
  },
  cargos: {
    type: Map,
    default: { owner: false, subowner: false, operator: false, developer: false, supervisor: false, designer: false }
  },
  vip: {
    type: Boolean,
    default: false
  },
  cmdcoldown: {
    type: String,
    default: '0000000000000'
  }
})

var Guild = new Schema({
  _id: {
    type: String
  },
  lang: {
    type: String,
    default: 'pt-BR'
  },
  prefix: {
    type: String,
    default: 'c!'
  },
  concierge: {
    type: Map,
    default: { welcome: { on: false, message: 'None', channel: 'None' }, byebye: { on: false, message: 'None', channel: 'None' } }
  },
  autorole: {
    type: Map,
    default: { on: false, idRoles: [] }
  },
  muteds: {
    type: Array,
    default: []
  },
})

var Command = new Schema({
  _id: {
    type: String
  },
  maintenance: {
    type: Boolean,
    default: false
  }
})

var Form = new Schema({
  _id: {
    type: String
  },
  user: {
    type: String
  },
  role: {
    type: String
  },
  reason: {
    type: String,
  },
  date: {
    type: String,
    default: '0000000000000'
  }
})

var Users = mongoose.model('Users', User)
var Guilds = mongoose.model('Guilds', Guild)
var Commands = mongoose.model('Commands', Command)
var Forms = mongoose.model('Forms', Form)
exports.Users = Users
exports.Guilds = Guilds
exports.Commands = Commands
exports.Forms = Forms