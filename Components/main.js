const Discord = require('discord.js');
const config = require('../config.json');
const bot = new Discord.Client();

bot.login(config.token);

const main = class Main {

    constructor() {
        this.partyActive = false;
        this.partyCreator = '';
        this.maxPlayer = 0;
        this.activePlayer = 1;
        this.partyCreatorMP;
        this.partyPlayer = [];
    }

    createParty (type) {       
        bot.on('message', (msg) => {
            if (msg.content === `${config.prefix}${config.command.create}${type}`) {
                msg.delete();
                if (!this.partyActive) {
                    msg.channel.send(`${msg.author} cherche des gens @everyone pour une partie ${type}.`)
                    this.partyActive = true;
                    this.partyCreator = msg.author.username;
                    this.partyCreatorMP = msg.author;
                    this.partyPlayer.push(this.partyCreator);
                } else {
                    msg.channel.send(`**Une recherche ${type} a déjà été lancée. Attendez la fin du recrutement ou tapez " ${config.prefix}${config.command.join}${type} "**`);
                }
           }
       });
    }

    joinParty (type) {
        let message;
        // let partyPlayer = [];
        
        bot.on('message', (msg) => {
            if (msg.content === `${config.prefix}${config.command.join}${type}`) {
                msg.delete();
                
                if (this.partyActive && this.activePlayer <= this.maxPlayer) {
                    if (this.partyPlayer[this.partyPlayer.indexOf(this.partyCreator)] === msg.author.username) {
                        msg.channel.send('QUOI TU VEUX TE RAJOUTER DEUX FOIS ! DAFUQ MAH DEWD !');
                    } else {
                        this.partyPlayer.push(`${msg.author.username}`);
                    }
                    message = `Player présent dans le groupe ${type} :\n`;
                    for (let player of this.partyPlayer) {
                        message += `-${player}\n`;
                    }  
                    msg.channel.send(message);
                    if (this.activePlayer == this.maxPlayer) {
                        this.partyActive = false;
                        this.activePlayer = 1;
                        message = '';
                        msg.channel.send('Groupe complet.');
                    } 
                } else {
                    if (this.activePlayer == this.maxPlayer) {
                        msg.channel.send(`**La partie ${type} est complète. Relancer une recherche avec " ${config.prefix}${config.command.create}${type}".**`);
                    } else {
                        msg.channel.send(`**Aucune partie ${type} a été créée, tapez " ${config.prefix}${config.command.create}${type} " pour en créer une.**`);
                    }
                }
                ++this.activePlayer;
            }

            let indexOfPlayer;
            let newMessage;
            if (msg.content === `${config.prefix}${config.command.leave}${type}`) {
                indexOfPlayer = this.partyPlayer.indexOf(`${msg.author.username}`);
                msg.delete();

                if (this.partyActive && this.partyCreator !== msg.author.username) {
                    if (this.partyPlayer[indexOfPlayer] === msg.author.username) {
                        if (indexOfPlayer > -1) {
                            this.partyPlayer.splice(indexOfPlayer, 1);
                        }
                        msg.channel.send(`${msg.author.username} a quitté(e) le groupe.`);
                    } else {
                        msg.channel.send('You doesn\'t exist');
                    }
                    newMessage = `Player présent dans le groupe ${type} :\n`;
                    for (let player of this.partyPlayer) {
                        newMessage += `-${player}\n`;
                    }
                    msg.channel.send(newMessage);
                } else {
                    if (!this.partyActive) {
                        msg.channel.send(`**Aucune partie ${type} a été créée, tapez " ${config.prefix}${config.command.create}${type} " pour en créer une.**`);
                    } else {
                        this.partyActive = false;
                        this.partyPlayer = [];
                        msg.channel.send(`**La partie ${type} a été détruite par ${this.partyCreator}, tapez " ${config.prefix}${config.command.create}${type} " pour en créer une.**`);
                    }
                }
            }
        });
    }

    stopParty (type) {
        bot.on('message', (msg) => {
            if (msg.content === `${config.prefix}${config.command.stop}${type}`) {
                msg.delete();

                if (this.partyActive && this.partyCreator === msg.author.username) {
                    this.partyActive = false;
                    this.activePlayer = 1;
                    msg.channel.send(`**La recherche de groupe ${type} a été arrêtée par ${this.partyCreator}.**`);
                } else if (!this.partyActive) {
                    msg.channel.send(`**Aucune partie ${type} a été créée, tapez " ${config.prefix}${config.command.create}${type} " pour en créer une.**`)
                } else {
                    msg.channel.send(`**Vous ne pouvez pas arrêter la recherche car elle ne vous appartient pas. MP ${this.partyCreatorMP}.**`);
                }
            }
        })
    }
}

module.exports = main;