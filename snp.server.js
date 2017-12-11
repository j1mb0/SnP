/*  Copyright 2017 James "J1mb0" Schiffer
    
    written by : J1mb0
    written for : CS494 Final Project
    Usage : node app.js
*/

    var
        snp_server = module.exports = { games : {}, game_count:0 },
        UUID        = require('node-uuid'),
        verbose     = true;

    //Since we are sharing code with the browser, we
    //are going to include some values to handle that.
    global.window = global.document = global;

    //Import shared game library code.
    require('./snp.types.js');
    require('./snp.map.js');
    require('./snp.player.js');
    require('./snp.protocol.js');
    require('./snp.core.js');
    snpProtocol = global.snpProtocol;
    game_core = global.game_core;
    //A simple wrapper for logging so we can toggle it,
    //and augment it for clarity.
    snp_server.log = function() {
        if(verbose) console.log.apply(this,arguments);
    };

    snp_server.fake_latency = 0;
    snp_server.local_time = 0;
    snp_server._dt = new Date().getTime();
    snp_server._dte = new Date().getTime();
    //a local queue of messages we delay if faking latency
    snp_server.messages = [];

    setInterval(function(){
        snp_server._dt = new Date().getTime() - snp_server._dte;
        snp_server._dte = new Date().getTime();
        snp_server.local_time += snp_server._dt/1000.0;
    }, 4);
    
    snp_server.onMessage = function(client, data) {
        var other_client = (client.game.player_host.userid == client.userid) 
                           ? client.game.player_client : client.game.player_host;

        var msg = snpProtocol.parseMsg(data);
    
        // server has a very easy job when dealing with messages. Handle updates and ping messages
        switch(msg.command) {
            case snpProtocol.ping    :
                client.send(snpProtocol.createMsg(snpProtocol.ping, msg.commanddata));
                break;
            case snpProtocol.update  :
                this.onInput(client, msg.commanddata);
                break;
            case snpProtocol.end     :
                // end marks the end of a game,  but not either player connections
                // so find new games for both of the existing players
                // this way there could be a new matchup - which is better than 
                // getting stuck playing the same person over and over again
                // but it would still be better if we updated this to include a game
                // lobby where people could choose who to play
                if(client.game != null){   // it is possible to get end messages when there is no game
                    if (this.games[client.game.game_id] != null){   // it is also possible that the game has no game_id
                        this.games[client.game.game_id].player_count--;
                        this.findGame(client);
        
                        if(this.games[client.game.game_id].player_count <= 0){
                            // and then destroy the current game instance
                            delete this.games[client.game_id];
                            this.game_count--;
        
                            this.log('game ' + client.game.game_id + ' removed. there are now ' + this.game_count + ' games' );    
                        }
                    }
                }
                break;
            default:
                console.log("client" + client.game.player_host.userid + " sent me a bad command: " + msg.command);
        } //command           
    }; //game_server.onMessage

    snp_server.onInput = function(client, updateData) {
        updateMsg = snpProtocol.parseUpdateData(updateData);
        
        //the client should be in a game, so
        //we can tell that game to handle the input
        if(client && client.game && client.game.gamecore) {
            client.game.gamecore.handle_server_input(client, updateMsg.updates, updateMsg.time, updateMsg.length);
        }

    }; //game_server.onInput

        //Define some required functions
    snp_server.createGame = function(player) {
       
        //Create a new game instance
        var thegame = {
                id : UUID(),                //generate a new id for the game
                player_host:player,         //so we know who initiated the game
                player_client:null,         //nobody else joined yet, since its new
                player_count:1              //for simple checking of state
            };

            //Store it in the list of game
        this.games[ thegame.id ] = thegame;

            //Keep track
        this.game_count++;

        //Create a new game core instance, this actually runs the
        //server side game code for correction purposes.
        thegame.gamecore = new game_core( thegame );
        //Start updating the game loop on the server
        thegame.gamecore.update( new Date().getTime() );

        //tell the player that they are now the host
        player.send(snpProtocol.createMsg(snpProtocol.host, String(thegame.gamecore.local_time).replace('.','-')));
        console.log('server host at  ' + thegame.gamecore.local_time);
        player.game = thegame;
        player.hosting = true;
        
        this.log('player ' + player.userid + ' created a game with id ' + player.game.id);

        return thegame;

    }; //game_server.createGame

        //we are requesting to kill a game in progress.
    snp_server.endGame = function(gameid, userid) {
        var thegame = this.games[gameid];

        if(thegame) {
            //stop the game updates immediate
            thegame.gamecore.stop_update();

            //if the game has two players, then one is leaving
            if(thegame.player_count > 1) {
                //send the players the message the game is ending
                if(userid == thegame.player_host.userid) {
                    //the host left
                    if(thegame.player_client) {
                        //tell them the game is over
                        thegame.player_client.send(snpProtocol.createMsg(snpProtocol.end));
                        //now look for/create a new game.
                        this.findGame(thegame.player_client);
                    }
                    
                } else {
                    //the other player left, notify host
                    if(thegame.player_host) {
                        //tell the client the game is ended
                        thegame.player_host.send(snpProtocol.createMsg(snpProtocol.end));
                        //since the game has finished, this player is no longer hosting
                        thegame.player_host.hosting = false;
                        //now look for/create a new game.
                        this.findGame(thegame.player_host);
                    }
                }
            }
            delete this.games[gameid];
            this.game_count--;

            this.log('game ' + gameid + ' removed. there are now ' + this.game_count + ' games' );

        } else {
            this.log('Could not end the game with ID: ' + gameid);
        }

    }; //game_server.endGame

    snp_server.startGame = function(game) {
        //right so a game has 2 players and wants to begin
        //the host already knows they are hosting,
        //tell the other client they are joining a game
        game.player_client.send(snpProtocol.createMsg(snpProtocol.join, game.player_host.userid));
        game.player_client.game = game;

        //tell both players that the game is ready to start
        game.player_client.send(snpProtocol.createMsg(snpProtocol.ready, String(game.gamecore.local_time).replace('.','-')));
        game.player_host.send(snpProtocol.createMsg(snpProtocol.ready, String(game.gamecore.local_time).replace('.','-')));
 
        //set this flag, so that the update loop can run it.
        game.active = true;

    }; //game_server.startGame

    snp_server.findGame = function(player) {

        this.log('looking for a game. We have : ' + this.game_count);

        //so there are games active,
        //lets see if one needs another player
        if(this.game_count) {
                
            var joined_a_game = false;

            //Check the list of games for an open game
            for(var gameid in this.games) {
                //only care about our own properties.
                if(!this.games.hasOwnProperty(gameid)) continue;
                //get the game we are checking against
                var game_instance = this.games[gameid];

                //If the game is a player short
                if(game_instance.player_count < 2) {

                    //someone wants us to join!
                    joined_a_game = true;
                    //increase the player count and store
                    //the player as the client of this game
                    game_instance.player_client = player;
                    game_instance.gamecore.players.playerB.instance = player;
                    game_instance.player_count++;

                    //start running the game on the server,
                    //which will tell them to respawn/start
                    this.startGame(game_instance);

                } //if less than 2 players
            } //for all games

            //now if we didn't join a game,
            //we must create one
            if(!joined_a_game) {

                this.createGame(player);

            } //if no join already

        } else { //if there are any games at all

                //no games? create one!
            this.createGame(player);
        }

    }; //game_server.findGame


