const PVE = require('./Components/pve');
const PVP = require('./Components/pvp');

const pve = new PVE;
const pvp = new PVP;

pve.createParty('pve');
pve.joinParty('pve');
pve.stopParty('pve');
pvp.createParty('pvp');
pvp.joinParty('pvp');
pvp.stopParty('pvp');