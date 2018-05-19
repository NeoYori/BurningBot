const Main = require('./main');

const pve = class pve extends Main {

    createParty(type) {
        super.createParty(type);
    }

    joinParty(type) {
        this.maxPlayer = 4;
        super.joinParty(type);
    }
}

module.exports = pve;