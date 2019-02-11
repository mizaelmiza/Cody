const { Client, Collection } = require('discord.js')
const { readdirSync, statSync } = require('fs')
module.exports = class Cody extends Client {
    constructor (options = {}) {
        super (options)
        this.fs = require('fs')
        this.commands = new Collection()
        this.Discord = require('discord.js')
        this.DBL = require("dblapi.js");
        this.dbl = new this.DBL(process.env.dbl, this);
        this.database = require('./database.js')
        this.i18next = require('i18next')
        this.translationBackend = require('i18next-node-fs-backend')
        this.moment = require('moment')
        this.ms = require('ms')
        this.setGameTime = Date.now()
        this.shardLog = async (cnt) => {
            cnt = `Shard ${this.shard.id + 1}: ${cnt}`
            console.log(cnt)
            return cnt;
        }
        this.guildsAlt = {
            size: async () => {
                let servidores = await this.shard.fetchClientValues('guilds.size');
                return servidores.reduce((a, b) => a + b, 0);
            }
        }
        this.usersAlt = {
            size: async () => {
                let usuarios = await this.shard.fetchClientValues('users.size');
                return usuarios.reduce((a, b) => a + b, 0);
            }
        }
        this.channelsAlt = {
            size: async () => {
                let canais = await this.shard.fetchClientValues('channels.size');
                return canais.reduce((a, b) => a + b, 0);
            }
        }
        global.String.prototype.firstUpperLetter = function () {
            var target = this
            var arr = target.split('')
            arr[0] = arr[0].toUpperCase()
            var newStr = arr.join('')
            return newStr
        }
        this.regionsLang = {
            'sydney': 'en-US',
            'us-south': 'en-US',
            'us-west': 'en-US',
            'us-central': 'en-US',
            'us-east': 'en-US',
            'brazil': 'pt-BR'
        }
        this.dataStaff = {
            owner: [],
            subowner: [],
            operator: [],
            developer: [],
            supervisor: [],
            designer: [],
            lastUpdate: Date.now()
        }
        this.setDataStaff = async () => {
            this.database.Users.find({}).then(async users => {
                users.forEach(async user => {
                    if((await this.verPerm(['owner', 'subowner', 'operator', 'developer', 'supervisor', 'designer'], false, user))) {
                        if(user.cargos.get('owner') && !this.dataStaff.owner.includes(user._id)) {
                            this.dataStaff.owner.push(user._id)
                        } else if(!user.cargos.get('owner') && this.dataStaff.owner.includes(user._id)) {
                            this.dataStaff.owner.splice(this.dataStaff.owner.indexOf(user_id), 1)
                        }
                        if(user.cargos.get('subowner') && !this.dataStaff.subowner.includes(user._id)) {
                            this.dataStaff.subowner.push(user._id)
                        } else if(!user.cargos.get('subowner') && this.dataStaff.subowner.includes(user._id)) {
                            this.dataStaff.subowner.splice(this.dataStaff.subowner.indexOf(user_id), 1)
                        }
                        if(user.cargos.get('operator') && !this.dataStaff.operator.includes(user._id)) {
                            this.dataStaff.operator.push(user._id)
                        } else if(!user.cargos.get('operator') && this.dataStaff.operator.includes(user._id)) {
                            this.dataStaff.operator.splice(this.dataStaff.operator.indexOf(user_id), 1)
                        }
                        if(user.cargos.get('developer') && !this.dataStaff.developer.includes(user._id)) {
                            this.dataStaff.developer.push(user._id)
                        } else if(!user.cargos.get('developer') && this.dataStaff.developer.includes(user._id)) {
                            this.dataStaff.developer.splice(this.dataStaff.developer.indexOf(user_id), 1)
                        }
                        if(user.cargos.get('supervisor') && !this.dataStaff.supervisor.includes(user._id)) {
                            this.dataStaff.supervisor.push(user._id)
                        } else if(!user.cargos.get('supervisor') && this.dataStaff.supervisor.includes(user._id)) {
                            this.dataStaff.supervisor.splice(this.dataStaff.supervisor.indexOf(user_id), 1)
                        }
                        if(user.cargos.get('designer') && !this.dataStaff.designer.includes(user._id)) {
                            this.dataStaff.designer.push(user._id)
                        } else if(!user.cargos.get('designer') && this.dataStaff.designer.includes(user._id)) {
                            this.dataStaff.designer.splice(this.dataStaff.designer.indexOf(user_id), 1)
                        }
                    }
                })
            })
            this.dataStaff.lastUpdate = Date.now();
        }
        this.newDocDB = async (doc) => {
            if(doc.type === 1) {
                if(doc.content.bot) return;
                var usuario = new this.database.Users({
                    _id: doc.id,
                    banned: { ban: false, tempban: false, time: 0 },
                    cargos: { owner: false, subowner: false, operator: false, developer: false, supervisor: false, designer: false },
                    vip: false,
                    cmdcoldown: '0000000000000'
                })
                usuario.save()
            } else if(doc.type === 2) {
                var servidor = new this.database.Guilds({
                    _id: doc.id,
                    lang: this.regionsLang[doc.content.region] ? this.regionsLang[doc.content.region] : 'pt-BR',
                    prefix: this.user.id === '539671041409024000' ? 'c.' : 'c!',
                    concierge: { welcome: { on: false, message: 'None', channel: 'None' }, byebye: { on: false, message: 'None', channel: 'None' } },
                    autorole: { on: false, idRoles: [] }
                })
                servidor.save()
            } else if(doc.type === 3) {
                var comando = new this.database.Commands({
                    _id: doc.id,
                    maintenance: false
                })
                comando.save()
            } else if(doc.type === 4) {
                var formulario = new this.database.Forms({
                    _id: doc.id,
                    user: doc.user,
                    role: doc.role,
                    reason: doc.reason,
                    date: Date.now()
                })
                formulario.save()
            }
        }
        this.setGame = async (content) => {
            if((Date.now() - this.setGameTime) >= 240000 || content.force) {
                if(content.random) {
                    var randomGames = [{
                        content: `Cody - ${await this.usersAlt.size()} usuários em ${await this.guildsAlt.size()} servidores com ${await this.channelsAlt.size()} canais.`,
                        type: 1,
                        url: 'https://www.twitch.tv/zmarciogod'
                    }, {
                        content: 'animes.',
                        type: 3,
                        url: false
                    }, {
                        content: 'Netflix.',
                        type: 3,
                        url: false
                    }, {
                        content: `${await this.usersAlt.size()} usuários fazerem suas coisas.`,
                        type: 2,
                        url: false
                    }, {
                        content: `Spotify`,
                        type: 2,
                        url: false
                    }, {
                        content: `Minecraft`,
                        type: 0,
                        url: false
                    }, {
                        content: `Robocraft`,
                        type: 0,
                        url: false
                    }, {
                        content: `GTA`,
                        type: 0,
                        url: false
                    }, {
                        content: `https://discord.gg/5Xt3uHF`,
                        type: 0,
                        url: false
                    }]
                    if(this.user.presence.game && randomGames.find(game => game.content === this.user.presence.game.name)) {
                        for(var i = 0; i < randomGames.length - 1; i++) {
                            if(randomGames[i].content === this.user.presence.game.name) {
                                randomGames.splice(i, 1)
                            }
                        }
                    }
                    var random = randomGames[Math.round(Math.random() * (randomGames.length - 1))]
                    if(random.url) {
                        this.user.setPresence({ game: { name: random.content, type: random.type, url: random.url } });
                    } else {
                        this.user.setPresence({ game: { name: random.content, type: random.type } });
                    }
                    this.setGameTime = Date.now()
                } else {
                    if(content.url) {
                        this.user.setPresence({ game: { name: content.txt, type: content.type, url: content.url } });
                    } else {
                        this.user.setPresence({ game: { name: content.txt, type: content.type } });
                    }
                }
            }
        }
        this.verPerm = async (prm, userDC, userDB) => {
            if(userDB._id === '337410863545843714' || userDC.id === '337410863545843714') return true;
            var dcPerms = ['CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'READ_MESSAGES', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'EXTERNAL_EMOJIS', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'USE_VAD', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES', 'MANAGE_ROLES_OR_PERMISSIONS', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS']
            if(!prm) return false;
            if(!userDB && !userDC) return false;
            var possui = false
            prm.forEach(perm => {
                if(possui) return;
                if(!dcPerms.includes(perm)) {
                    if(userDB.cargos.get(perm)) { possui = true }
                } else {
                    if(userDC.hasPermission([perm])) { possui = true }
                }
            })
            return possui;
        }
        this.initializeEvents('./events')
        this.initializeCommands('./commands')
    }
    initializeCommands (path) {
        readdirSync(path).forEach(file => {
            try {
                const filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    const Command = require(filePath)
                    const commandName = file.replace(/.js/g,'').toLowerCase()
                    const command = new Command(commandName, this)
                    this.commands.set(commandName, command)
                } else if (statSync(filePath).isDirectory()) {
                    this.initializeCommands(filePath)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
    initializeEvents (path) {
        readdirSync(path).forEach(file => {
            try {
                let filePath = path + '/' + file
                if (file.endsWith('.js')) {
                    let Listener = require(filePath)
                    this.on(file.replace(/.js/g, ''), Listener)
                } else if (statSync(filePath).isDirectory()) {
                    this.initializeEvents(filePath)
                }
            } catch (error) {
                console.log(error)
            }
        })
    }
}