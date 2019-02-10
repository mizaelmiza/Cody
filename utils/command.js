module.exports = class command {
    constructor(name, client) {
        this.name = name;
        this.client = client;
        this.aliases = [];
    }
    process({message, args, prefix, usuario, servidor}, t, setFixedT) {
        return this.run({message, args, prefix, usuario, servidor}, t, setFixedT);
    }
    run () {}
}