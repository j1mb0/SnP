/*  Copyright 2017 James "J1mb0" Schiffer

    Starts a game server the "Spray And Pray" multiplayer game

    written by : J1mb0
    written for : CS494 Final Project
    Usage : node app.js
*/

var
    gameport        = process.env.PORT || 4004,

    net             = require('socket.io'),
    express         = require('express'),
    UUID            = require('node-uuid'),

    verbose         = false,
    http            = require('http'),
    app             = express(),
    server          = http.createServer(app);

/* Express server set up. */

//The express server handles passing our content to the browser,
//As well as routing users where they need to go. This example is bare bones
//and will serve any file the user requests from the root of your web server (where you launch the script from)
//so keep this in mind - this is not a production script but a development teaching tool.

    //Tell the server to listen for incoming connections
server.listen(gameport)

    //Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + gameport );

    //By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){
    console.log('trying to load %s', __dirname + '/index.html');
    res.sendfile( '/index.html' , { root:__dirname });
});

    //This handler will listen for requests on /*, any file from the root of our server.
    //See expressjs documentation for more info on routing.

app.get( '/*' , function( req, res, next ) {

        //This is the current file they have requested
    var file = req.params[0];

        //For debugging, we can track what files are requested.
    if(verbose) console.log('\t :: Express :: file requested : ' + file);

        //Send the requesting client the file.
    res.sendfile( __dirname + '/' + file );

}); //app.get *


/* Socket.IO server set up. */

//Express and socket.io can work together to serve the socket.io client files for you.
//This way, when the client requests '/socket.io/' files, socket.io determines what the client needs.
        
// Create a server instance, and chain the listen function to it
var netServer = net.listen(server);

//Configure the socket.io connection settings.
        //See http://socket.io/
netServer.configure(function (){
    netServer.set('log level', 0);
});
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
//var netServer = net.createServer();  
//netServer.on('connection', handleClientConnection);

// netServer.listen(gameport, function() {  
//   console.log('server listening to %j', server.address());
//});

//Enter the game server code. The game server handles
//client connections looking for a game, creating games,
//leaving games, joining games and ending games when they leave.
game_server = require('./snp.server.js');

//Socket.io will call this function when a client connects,

//Socket.io will call this function when a client connects,
//So we can send that client looking for a game to play,
//as well as give that client a unique ID to use so we can
//maintain the list if players.
netServer.sockets.on('connection', function (client) { 

    //Generate a new UUID, looks something like
    //5b2ca132-64bd-4513-99da-90e838ca47d1
    //and store this on their socket/connection
    client.userid = UUID();

    // We have a connection - a socket object is assigned to the connection automatically
    //console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);

    //tell the player they connected, giving them their id
    var connMsg = snpProtocol.createMsg(snpProtocol.connect, client.userid)
    client.send(connMsg);
    
    //now we can find them a game to play with someone.
    //if no game exists with someone waiting, they create one and wait.
    game_server.findGame(client);

    //Useful to know when someone connects
    console.log('\t socket.io:: player ' + client.userid + ' connected');
      
    //conn.on('data', onConnData);
    //conn.once('close', onConnClose);
    //conn.on('error', onConnError);

    client.on('message', function(m) {
        game_server.onMessage(client, m);    
    }); //client.on message

    client.on('disconnect', function () {
        //Useful to know when someone disconnects
        console.log('\t socket.io:: client disconnected ' + client.userid + ' ' + client.game_id);

        //If the client was in a game, set by game_server.findGame,
        //we can tell the game server to update that game state.
        if(client.game && client.game.id) {
            //player leaving a game should destroy that game
            game_server.endGame(client.game.id, client.userid);
        } //client.game_id
    }); //client.on disconnect

//    function onConnError(err) {
//        console.log('Connection %s error: %s', remoteAddress, err.message);
//    }
});
