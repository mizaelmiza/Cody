require('dotenv').config()

const Cody = require('./Cody')
const client = new Cody()

client.login(process.env.token)