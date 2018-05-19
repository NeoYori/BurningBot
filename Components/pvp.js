const Main = require('./main');

const pve = class pve extends Main {

    createParty(type) {
        super.createParty(type);
        this.maxPlayer = 6;
    }
}

module.exports = pve;