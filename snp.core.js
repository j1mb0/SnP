/*  Copyright 2017 James "J1mb0" Schiffer
    
    written by : J1mb0
    written for : CS494 Final Project
    Usage : node app.js
*/

//The main update loop runs on requestAnimationFrame,
//Which falls back to a setTimeout loop on the server
//Code below is from Three.js, and sourced from links below

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller
    // fixes from Paul Irish and Tino Zijdel

var frame_time = 60/1000; // run the local game at 16ms/ 60hz
if('undefined' != typeof(global)) frame_time = 45; //on server we run at 45ms, 22hz

( function () {

    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

    for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x ) {
        window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
        window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
    }

    if ( !window.requestAnimationFrame ) {
        window.requestAnimationFrame = function ( callback, element ) {
            var currTime = Date.now(), timeToCall = Math.max( 0, frame_time - ( currTime - lastTime ) );
            var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if ( !window.cancelAnimationFrame ) {
        window.cancelAnimationFrame = function ( id ) { clearTimeout( id ); };
    }

}() );


//********************************MENU BUTTON SIMPLETON************************/
//Hold's functions and details for the menu


/************************************BUTTON CLASS*************************************************/
function Button(game_instance, id, cost, duration){
    this.game = game_instance;
    this.row = -1;
    this.column = -1;
    this.id = id;
    this.cost  = cost;
    this.duration = duration;
    this.isActive = false;
    this.payX = 0;
    this.payY = 0;
    this.costX = 0;
    this.costY = 0;
    
};

Button.prototype.findLoc = function(buttonLayer, tileWidth, tileHeight, leftOff, rightOff, upOff){
    var loc = buttonLayer.search(this.id);
    this.row = loc.row;
    this.column = loc.col;
    this.costX = (this.column * tileHeight) - leftOff; 
    this.costY = (this.row  * tileWidth) + upOff ;  
    
    this.payX = (this.column   * tileHeight) + rightOff;
    this.payY = (this.row  * tileWidth)  + upOff;
};
        //Now the main game class. This gets created on
        //both server and client. Server creates one for
        //each game that is hosted, and client creates one
        //for itself to play the game.


/*********************************************RASTERS CLASS***************************************/
//I couldn't figure out json files, so I decided to parse the data myself
//this is mostly cause I'm dumb as hell
//!!!!!FIGURE OUT JSON FILES, BE A BETTER PERSON
var theRasters = {
    //this. = 50;
    //tileWidth: = 50; 
    //this.gridWidth = 24;
    //this.gridHeight = 14;
    
    //for the grass and stuff
    baseRaster: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 132, 133, 133, 133, 133, 133, 133, 133, 133, 133, 133, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 172, 153, 153, 153, 153, 153, 153, 173, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 172, 173, 173, 173, 173, 174, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 132, 134, 30, 30, 30, 171, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 132, 153, 154, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 152, 153, 153, 134, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 172, 173, 173, 174, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 132, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 153, 30, 30, 30, 30, 132, 133, 153, 153, 59, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 133, 133, 153, 153, 153, 153, 59, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    
    //hills and water n base
    firstRaster: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 178, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 142, 142, 142, 0, 0, 0, 0, 0, 178, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141, 142, 142, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141, 142, 142, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 38, 39, 36, 37, 38, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 156, 0, 0, 0, 58, 57, 57, 153, 153, 59, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 172, 173, 153, 154, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 172, 174, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 111, 0, 0, 0, 0, 37, 38, 39, 0, 0, 0, 0, 0, 38, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 58, 59, 0, 0, 0, 0, 0, 58, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 57, 57, 58, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    
    //another layer of terrain
    secondRaster: [126, 127, 128, 179, 159, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 23, 146, 147, 148, 33, 34, 159, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 42, 43, 146, 147, 148, 53, 54, 55, 159, 139, 140, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 146, 147, 148, 73, 74, 75, 178, 179, 180, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 146, 147, 148, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 161, 162, 162, 146, 147, 148, 113, 114, 115, 0, 0, 0, 0, 0, 138, 139, 140, 0, 0, 0, 0, 0, 0, 0, 0, 135, 136, 146, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 158, 159, 159, 140, 0, 0, 0, 0, 0, 0, 0, 155, 32, 146, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 178, 159, 159, 159, 140, 0, 0, 0, 0, 0, 0, 51, 52, 146, 147, 148, 78, 79, 0, 0, 0, 0, 0, 0, 0, 178, 179, 179, 180, 0, 0, 0, 0, 0, 0, 71, 72, 146, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 140, 0, 0, 91, 92, 146, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 178, 159, 140, 0, 0, 112, 146, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 178, 159, 139, 139, 140, 146, 147, 148, 25, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 135, 136, 178, 179, 159, 159, 166, 167, 168, 45, 46, 0, 0, 70, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 155, 156, 0, 0, 178, 159],
    
    //placeables
    placeablesRaster: [0, 0, 0, 0, 0, 0, 137, 137, 137, 137, 137, 137, 0, 0, 0, 137, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 137, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 137, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 137, 0, 137, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 137, 137, 0, 0, 0, 0, 137, 0, 0, 137, 137, 0, 0],
    
    //the buttons
    buttonRaster: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 181, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 124, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    
    //button frames
    frameRaster: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 29, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    
    //empty highlight laytheMap.grer
    highlightRaster: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 126, 127, 127, 127, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 146, 147, 147, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 146, 147, 147, 147, 148, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 166, 167, 167, 167, 168, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

};

/* The game_core class */
var game_core = function(game_instance){
    
        //Store the instance, if any
    this.instance = game_instance;
        //Store a flag if we are the server
    this.server = this.instance !== undefined;

    if (this.server){    
        require('./snp.map.js');
        require('./snp.player.js');
        game_map = global.game_map;
        aPlayer = global.aPlayer;
        Crop = global.Crop;
        atlasTiles = global.atlasTiles;
    }

    this.tileHeight = 50;
    this.tileWidth = 50; 
    this.gridWidth = 24;
    this.gridHeight = 14;

    this.atlasWidth = 20;

    succesfullyDraw = false;

    //Used to draw and process inputs
    this.world = {
        width : this.tileWidth * this.gridWidth,
        height : this.tileHeight * this.gridHeight
    };
    
    this.start = false;
    this.won  = false;
    this.lost = false;

    //A local timer for precision on server and client
    this.local_time = 0.016;            //The local timer
    this._dt = new Date().getTime();    //The local timer delta
    this._dte = new Date().getTime();   //The local timer last frame time
       
        //Start a fast paced timer for measuring time easier
    this.create_timer();

        // start making common game related data
    this.snp_map = new game_map(this.gridHeight, 
                                this.gridWidth,
                                this.tileHeight,
                                theRasters.baseRaster,
                                theRasters.firstRaster,
                                theRasters.secondRaster,
                                theRasters.placeablesRaster,
                                theRasters.buttonRaster,
                                theRasters.frameRaster,
                                theRasters.highlightRaster);
    
    this.Wheat    = new Crop(15000, 20000, 100, 50, atlasTiles.wheat, atlasTiles.wheatH);
    this.Corn     = new Crop(20000, 20000, 100, 200, atlasTiles.corn, atlasTiles.cornH);
    this.Cherry   = new Crop(30000, 10000, 200, 500, atlasTiles.cherry, atlasTiles.cherryH);
    this.EnWheat  = new Crop(15000, 20000, 150, 25, atlasTiles.enWheat, atlasTiles.enWheatH);
    this.EnCorn   = new Crop(20000, 20000, 100, 200, atlasTiles.enCorn, atlasTiles.enCornH);
    this.EnCherry = new Crop(30000, 10000, 200, 500, atlasTiles.enCherry, atlasTiles.enCherryH);

    this.theMenu = {
        moneyPos: {x: 20, y: 40},
        aiMoneyPos: {x: 20, y: 80},
        leftOff: 35,    //25
        rightOff: 55,   //75
        upOff: 25
    };

    this.wheatBut   = new Button(this, atlasTiles.wheat,        -1, -1);
    this.cornBut    = new Button(this, atlasTiles.corn,         -1, -1);
    this.cherryBut  = new Button(this, atlasTiles.cherry,       -1, -1);
    this.protestBut = new Button(this, atlasTiles.protest,     200, 15000);
    this.ladybugBut = new Button(this, atlasTiles.ladybug,      25, -1);
    this.baseBut    = new Button(this, atlasTiles.baseBut,     500, -1);
    this.workerBut  = new Button(this, atlasTiles.workerBut,    75, 15000);
                   
    //find the location of the buttons
    this.wheatBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);  
    this.cornBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);
    this.cherryBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);
    this.protestBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);
    this.ladybugBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);
    this.baseBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);
    this.workerBut.findLoc(this.snp_map.buttonLayer, this.tileWidth, this.tileHeight, this.theMenu.leftOff, this.theMenu.rightOff, this.theMenu.upOff);
    

        //Client specific initialisation
    if(!this.server) {        
        //atlas image
        this.atlas = new Image();
        this.atlas.src="img/betatextures.png";

            //Create the default configuration settings
        this.client_create_configuration();

            //A list of recent server updates we interpolate across
            //This is the buffer that is the driving factor for our networking
        this.server_updates = [];

            //Connect to the socket.io server!
        this.client_connect_to_server();

            //We start pinging the server to determine latency
        this.client_create_ping_timer();
        
        this.players = {
            self : new aPlayer(this, null, this.Wheat, this.Corn, this.Cherry, false),
            other  : new aPlayer(this, null, this.Wheat, this.Corn, this.Cherry, true)
        }
    } else { //if !server
        this.players = {
            playerA : new aPlayer(this, this.instance.player_host, this.Wheat, this.Corn, this.Cherry, false),
            playerB : new aPlayer(this, this.instance.player_client, this.Wheat, this.Corn, this.Cherry, true)
        }
        this.server_time = 0;
        this.laststateA = {};
        this.laststateB = {};
    }
}; //game_core.constructor

//server side we set the 'game_core' class to a global type, so that it can use it anywhere.
if( 'undefined' != typeof global ) {
    module.exports = global.game_core = game_core;
}

/*
    Helper functions for the game code

        Here we have some common maths and game related code to make working with 2d vectors easy,
        as well as some helpers for rounding numbers to fixed point.

*/
// (4.22208334636).fixed(n) will return fixed point value to n places, default n = 3
Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

game_core.prototype.jsonifyUpdates = function(player){
    var jsonString = "";
    for(var i = 0; i < player.inputs.length; i++){
        update = player.inputs[i];
        jsonString += JSON.stringify(update);
        if(i != player.inputs.length - 1){
            jsonString += '-';
        } 
    }
    return jsonString;
}


//gets a row and column from an x and y position
game_core.prototype.getRowCol = function (x, y){
    
    //get row
    var row = y / this.tileWidth;
    var column = x / this.tileHeight;
    
    //round it down
    row = Math.floor(row);
    column = Math.floor(column);
    
    return {"row": row, "column": column};
};

game_core.prototype.findButtonLocation = function(buttonInstance){

};
/*************************************PROTEST BUTTON DRIVER SIMPLETON****************************/

game_core.prototype.Protest = {
    
    activate: function(){
        thePlayer.money -= protestBut.cost;
        theAI.canWork = false;
        
        this.snp_map.highlightLayer.data[protestBut.column][protestBut.row] = atlasTiles.hightlight;
        this.snp_map.highlightLayer.data[theAI.baseColumn][theAI.baseRow] = atlasTiles.protest;
        
        setTimeout(function() {
            theAI.canWork = true;
        
            this.snp_map.highlightLayer.data[protestBut.column][protestBut.row] = atlasTiles.empty;
            this.snp_map.highlightLayer.data[theAI.baseColumn][theAI.baseRow] = atlasTiles.empty;
        
        }, protestBut.duration);
        
    }
};

/***************************BUTTON TO BUILD BASE SIMPLETON*********************/
game_core.prototype.BuildBase = {
    
    activate: function(){
        baseBut.isActive = true;
        var i = this.baseBut.row;
        var j = this.baseBut.column;
        
        this.snp_map.highlightLayer.data[j][i] = atlasTiles.hightlight;
    },
    
    checkLoc: function(row, column){
        var check = true;
        for(var j = column - 1; j <= column + 1; j++){
            for(var i = row - 1; i <= row + 1; i++){
                
                if(this.snp_map.secondLayer.data[j][i] !== atlasTiles.empty)
                {
                    check = false;
                }                
            }
        }
        return check;
    },
    
    place: function(row, column){
        var check = BuildBase.checkLoc(row, column);
        
        if(check){
            this.snp_map.secondLayer.data[row][column] = atlasTiles.pBase1;
            this.snp_map.placeableLayer.data[row][column] = atlasTiles.empty;
            
            this.snp_map.secondLayer.data[row + 1][column] = atlasTiles.pBase2;
            this.snp_map.placeableLayer.data[row + 1][column] = atlasTiles.empty;
            
            this.snp_map.secondLayer.data[row][column + 1] = atlasTiles.pBase3;
            this.snp_map.placeableLayer.data[row][column + 1] = atlasTiles.empty;
            
            this.snp_map.secondLayer.data[row + 1][column + 1] = atlasTiles.pBase4;
            this.snp_map.placeableLayer.data[row + 1][column + 1] = atlasTiles.empty;
            
            baseBut.isActive = false;
            this.snp_map.highlightLayer.data[baseBut.row][baseBut.column] = atlasTiles.empty;
            thePlayer.money -= baseBut.cost;
        }
    }
};

/************************* WORKER BUTTON SIMPLETON ************************************/
//activates player ai, basically hiring workers
game_core.prototype.worker = {
    activate: function(thePlayer){
        var i = thePlayer.baseRow;
        var j = thePlayer.baseColumn;
        
        thePlayer.money -= workerBut.cost;
        
        this.snp_map.highlightLayer.data[this.workerBut.row][this.workerBut.column] = atlasTiles.hightlight;
        
        thePlayer.canWork = true;
        
        setTimeout(function() {
            thePlayer.canWork = false;
            this.snp_map.highlightLayer.data[this.workerBut.row][this.workerBut.column] = atlasTiles.empty;        
        }, this.workerBut.duration);
    }
};

//For the server, we need to cancel the setTimeout that the polyfill creates
game_core.prototype.stop_update = function() {  window.cancelAnimationFrame( this.updateid );  };
    

/*

 Common functions
 
    These functions are shared between client and server, and are generic
    for the game state. The client functions are client_* and server functions
    are server_* so these have no prefix.

*/
game_core.prototype.initializePlayer = function(player)
{
    if(player.host === false){
        player.baseID1 = atlasTiles.enBase1;
        player.baseID2 = atlasTiles.enBase2;
        player.baseID3 = atlasTiles.enBase3;
        player.baseID4 = atlasTiles.enBase4;

        player.crop1 = this.EnWheat;
        player.crop2 = this.EnCorn;
        player.crop3 = this.EnCherry;
        player.curCrop = player.crop1;
    }
    
    baseLoc = this.snp_map.secondLayer.search(player.baseID1);
    player.baseRow = baseLoc.row;
    player.baseColumn = baseLoc.col;
}


    //Main update loop
game_core.prototype.update = function(t) {
    
        //Work out the delta time
    this.dt = this.lastframetime ? ( (t - this.lastframetime)/1000.0).fixed() : 0.016;

        //Store the last frame time
    this.lastframetime = t;

        //Update the game specifics
    if(!this.server) {
        this.client_update();
    } else {
        this.server_update();
    }

        //schedule the next update
    this.updateid = window.requestAnimationFrame( this.update.bind(this), this.viewport );

}; //game_core.update


//this checks if a button was pressed
game_core.prototype.clickButton = function(row, column, thePlayer){
    var check = false;
    if(row === this.protestBut.row && column === this.protestBut.column && thePlayer.money >= this.protestBut.cost)
    {
        Protest.activate();
    }
    if(row === this.baseBut.row && column === this.baseBut.column && thePlayer.money >= this.baseBut.cost)
    {
        BuildBase.activate();
        check = true;
    }
    if(row === this.workerBut.row && column === this.workerBut.column && thePlayer.money >= this.workerBut.cost){
        worker.activate();
    }
    
    return check;
};
    
game_core.prototype.process_input = function( player ) {

    //It's possible to have recieved multiple inputs by now,
    //so we process each one
    for(var i = 0; i < player.inputs.length; i++){
        // check for first button click (e.g. ready)
        if(player.ready === false){
            player.ready = true;
        }
        
        var update = player.inputs[i];

            //check if a button was pressed or not
        var butPress = this.clickButton(update.row, update.col);

        if(butPress){
            //why is this empty? I forget
            //clickButton will return true if the base button was clicked
            // so we don't process the input if a button was pressed, click button does all of that
        }
        else if(this.baseBut.isActive)
        {
            //if the base button is active, place a base
            BuildBase.place(update.row, update.col);
        } 
        else 
        {
            //try to plant - not a button press and no other click modifiers are present. 
            if (player.money >= player.curCrop.cost  
                && this.snp_map.canGrowCrops(update.row, update.col, player.baseID1, player.baseID2, player.baseID3, player.baseID4)){

                this.snp_map.place(update.row, update.col, player.curCrop);
                player.plant();
            }
            else { // try to harvest
                if (player.canHarvest(this.snp_map.idLayer[update.row][update.col].tileType)){
                    player.harvest(this.snp_map.idLayer[update.row][update.col]);
                    this.snp_map.remove(update.row, update.col);
                }
            }  
        } //for each input command
    } //if we have inputs
    
   this.update_status(player);  
};

//checks the general status of the game.
game_core.prototype.update_status = function(thePlayer){ 
    //check if the game has been won or lost
    if(thePlayer.money >= thePlayer.toWin){
        thePlayer.won = true;
        this.start = false;
        // reapply the original highlight layer (make backup at initialization and then switch to it)
    }
};

/*

 Server side functions
 
    These functions below are specific to the server side only,
    and usually start with server_* to make things clearer.

*/

    //Makes sure things run smoothly and notifies clients of changes
    //on the server side
game_core.prototype.server_update = function(){

        //Update the state of our local clock to match the timer
    this.server_time = this.local_time;

    // process inputs
    this.process_input(this.players.playerA);
    this.process_input(this.players.playerB);

    // check if both players are ready
    if(this.start === false){
        if(this.players.playerA.ready === true && this.players.playerB.ready === true){
            this.start = true;
            this.snp_map.highlightLayer.initialize();
            if (this.players.playerA.instance.hosting === true){
                this.players.playerA.host = true;
            }
            else {
                this.players.playerB.host = true;
            }
            this.initializePlayer(this.players.playerA);
            this.initializePlayer(this.players.playerB);            
        }
    } 
    
    if (this.players.playerA.inputs.length > 0) // we have some new updates to send to clients
    {
        //Make a snapshot of the current state, for updating the clients
        var packetB = this.jsonifyUpdates(this.players.playerA);
        packetB += '.';
        packetB += this.server_time.toFixed(3).replace('.','-') + '.';
        packetB += this.players.playerA.inputs.length.toString();

        //Send the snapshot to the 'host' player
        if(this.players.playerB.instance) {
            this.players.playerB.instance.emit( 'onserverupdate', packetB);
        }

        console.log('server sending to B(' + this.players.playerB.instance.userid + ')  : ' + packetB);
            // clear the updates
        this.players.playerA.inputs = [];
    }
        
    if(this.players.playerB.inputs.length > 0)
    {
        //Make a snapshot of the current state, for updating the clients
        var packetA = this.jsonifyUpdates(this.players.playerB);
        packetA += '.';
        packetA += this.server_time.toFixed(3).replace('.','-') + '.';
        packetA += this.players.playerB.inputs.length.toString();

            //Send the snapshot to the 'client' player
        if(this.players.playerA.instance) {
            this.players.playerA.instance.emit( 'onserverupdate', packetA );
        }
        console.log('server sending to A(' + this.players.playerA.instance.userid + ')  : ' + packetA);    
            // clear the updates
        this.players.playerB.inputs = [];
    }
        

}; //game_core.server_update


game_core.prototype.handle_server_input = function(client, inputs, sendTime, numInputs) {

    
    console.log('server recieved from ' + client.userid + ' : ' + inputs);

        //Fetch which client this refers to out of the two
    var player_client =
        (client.userid == this.players.playerA.instance.userid) ?
            this.players.playerA : this.players.playerB;

        //Store the input on the player instance for processing in the physics loop
    for(var i = 0; i < numInputs; i++){
        player_client.inputs.push(JSON.parse(inputs[i]));
    }
   
}; //game_core.handle_server_input

/*

 Client side functions

    These functions below are specific to the client side only,
    and usually start with client_* to make things clearer.

*/

//is called by click event
    //this will calculate the row and column of the click,
    //and update the drawing map (placeableLayer) accordingly
    
game_core.prototype.client_process_click = function(x, y){
    //get the row and column
    var position = this.getRowCol(x, y);

    this.players.self.inputs.push({row: position.row,
                                   col: position.column,
                                   t:   self.local_time});
    this.players.self.input_seq++;    
};
    
//draws the map. Takes in an 2d array of integer values and prints out the corresponding tile
game_core.prototype.client_draw_map = function(the2dArray){
    
    //outside is the rows
    for(var j = 0; j <= this.gridHeight - 1; j++){
        // inside is the columns
        for(var i = 0; i <= this.gridWidth - 1; i++){          
            //every value above -1 is a tile to be drawn
            if(the2dArray[j][i] > atlasTiles.empty){
                var x = (the2dArray[j][i] % this.atlasWidth) * this.tileWidth;
                var y = the2dArray[j][i]; 
                y = (Math.floor(y / this.atlasWidth)); 
                y *= this.tileHeight;
                
                //an overload of draw image
                this.ctx.drawImage(this.atlas, 
                                    x, 
                                    y, 
                                    this.tileWidth, 
                                    this.tileHeight, 
                                    i * this.tileWidth, 
                                    j * this.tileHeight, 
                                    this.tileWidth, 
                                    this.tileHeight);
            }
            //console.log(mapData[i][j]);
        }
    }
};

//redraws the map, layer by layer
game_core.prototype.client_redraw_map = function (){
    this.client_draw_map(this.snp_map.baseLayer.data);
    this.client_draw_map(this.snp_map.firstLayer.data);
    this.client_draw_map(this.snp_map.secondLayer.data);
    this.client_draw_map(this.snp_map.placeableLayer.data);
    this.client_draw_map(this.snp_map.buttonLayer.data);
    this.client_draw_map(this.snp_map.frameLayer.data);
    this.client_draw_map(this.snp_map.highlightLayer.data); 
};

game_core.prototype.client_handle_input = function(){

        //This takes input from the client and keeps a record,T
        //It also sends the input information to the server immediately
        //as it is pressed. It also tags each input with a sequence number.
    if(this.players.self.inputs.length) {

            //Send the packet of information to the server.
            //The input packets are labelled with an 'i' in front.
        var server_packet = 'i.';
        server_packet += this.jsonifyUpdates(this.players.self);
        server_packet += '.';
        server_packet += this.local_time.toFixed(3).replace('.','-') + '.';
        server_packet += this.players.self.inputs.length.toString();

            //Go
        this.socket.send(  server_packet  );

    }

}; //game_core.client_handle_input


game_core.prototype.client_process_net_prediction_correction = function() {
    
        //No updates...
    if(!this.server_updates.length) return;

        //The most recent server update
    var latest_server_data = this.server_updates[this.server_updates.length-1];

        //Our latest server click
    var my_latest_server_click = this.players.self.host ? latest_server_data.position : latest_server_data.position;

        //Update the debug server position block
    this.ghosts.server_pos_self.pos = this.pos(my_server_pos);

            //here we handle our local input prediction ,
            //by correcting it with the server and reconciling its differences

        var my_last_input_on_server = this.players.self.host ? latest_server_data.his : latest_server_data.cis;
        if(my_last_input_on_server) {
                //The last input sequence index in my local input list
            var lastinputseq_index = -1;
                //Find this input in the list, and store the index
            for(var i = 0; i < this.players.self.inputs.length; ++i) {
                if(this.players.self.inputs[i].seq == my_last_input_on_server) {
                    lastinputseq_index = i;
                    break;
                }
            }

                //Now we can crop the list of any updates we have already processed
            if(lastinputseq_index != -1) {
                //so we have now gotten an acknowledgement from the server that our inputs here have been accepted
                //and that we can predict from this known position instead

                    //remove the rest of the inputs we have confirmed on the server
                var number_to_clear = Math.abs(lastinputseq_index - (-1));
                this.players.self.inputs.splice(0, number_to_clear);
                    //The player is now located at the new server position, authoritive server
                this.players.self.cur_state.pos = this.pos(my_server_pos);
                this.players.self.last_input_seq = lastinputseq_index;
                    //Now we reapply all the inputs that we have locally that
                    //the server hasn't yet confirmed. This will 'keep' our position the same,
                    //but also confirm the server position at the same time.
                this.client_update_physics();
                this.client_update_local_position();

            } // if(lastinputseq_index != -1)
        } //if my_last_input_on_server

}; //game_core.client_process_net_prediction_correction
    

game_core.prototype.client_process_net_updates = function() {

        //No updates...
    if(!this.server_updates.length) return;

    //First : Find the position in the updates, on the timeline
    //We call this current_time, then we find the past_pos and the target_pos using this,
    //searching throught the server_updates array for current_time in between 2 other times.
    // Then :  other player position = lerp ( past_pos, target_pos, current_time );

        //Find the position in the timeline of updates we stored.
    var current_time = this.client_time;
    var count = this.server_updates.length-1;
    var target = null;
    var previous = null;

        //We look from the 'oldest' updates, since the newest ones
        //are at the end (list.length-1 for example). This will be expensive
        //only when our time is not found on the timeline, since it will run all
        //samples. Usually this iterates very little before breaking out with a target.
    for(var i = 0; i < count; ++i) {

        var point = this.server_updates[i];
        var next_point = this.server_updates[i+1];

            //Compare our point in time with the server times we have
        if(current_time > point.t && current_time < next_point.t) {
            target = next_point;
            previous = point;
            break;
        }
    }

        //With no target we store the last known
        //server position and move to that instead
    if(!target) {
        target = this.server_updates[0];
        previous = this.server_updates[0];
    }

        //Now that we have a target and a previous destination,
        //We can interpolate between then based on 'how far in between' we are.
        //This is simple percentage maths, value/target = [0,1] range of numbers.
        //lerp requires the 0,1 value to lerp to? thats the one.

     if(target && previous) {

        this.target_time = target.t;

        var difference = this.target_time - current_time;
        var max_difference = (target.t - previous.t).fixed(3);
        var time_point = (difference/max_difference).fixed(3);

            //Because we use the same target and previous in extreme cases
            //It is possible to get incorrect values due to division by 0 difference
            //and such. This is a safe guard and should probably not be here. lol.
        if( isNaN(time_point) ) time_point = 0;
        if(time_point == -Infinity) time_point = 0;
        if(time_point == Infinity) time_point = 0;

            //The most recent server update
        //var latest_server_data = this.server_updates[ this.server_updates.length-1 ];

            //These are the exact server positions from this tick, but only for the ghost
        //var other_server_pos = this.players.self.host ? latest_server_data.cp : latest_server_data.hp;

            //The other players positions in this timeline, behind us and in front of us
        //var other_target_pos = this.players.self.host ? target.cp : target.hp;
        //var other_past_pos = this.players.self.host ? previous.cp : previous.hp;

            //update the dest block, this is a simple lerp
            //to the target from the previous point in the server_updates buffer
        //this.ghosts.server_pos_other.pos = this.pos(other_server_pos);
        //this.ghosts.pos_other.pos = this.v_lerp(other_past_pos, other_target_pos, time_point);

        if(this.client_smoothing) {
            //this.players.other.pos = this.v_lerp( this.players.other.pos, this.ghosts.pos_other.pos, this._pdt*this.client_smooth);
        } else {
            //this.players.other.pos = this.pos(this.ghosts.pos_other.pos);
        }

            //Now, if not predicting client movement , we will maintain the local player position
            //using the same method, smoothing the players information from the past.
        if(!this.client_predict && !this.naive_approach) {

                //These are the exact server positions from this tick, but only for the ghost
            //var my_server_pos = this.players.self.host ? latest_server_data.hp : latest_server_data.cp;

                //The other players positions in this timeline, behind us and in front of us
            //var my_target_pos = this.players.self.host ? target.hp : target.cp;
            //var my_past_pos = this.players.self.host ? previous.hp : previous.cp;

                //Snap the ghost to the new server position
            //this.ghosts.server_pos_self.pos = this.pos(my_server_pos);
            //var local_target = this.v_lerp(my_past_pos, my_target_pos, time_point);

                //Smoothly follow the destination position
            if(this.client_smoothing) {
                //this.players.self.pos = this.v_lerp( this.players.self.pos, local_target, this._pdt*this.client_smooth);
            } else {
                //this.players.self.pos = this.pos( local_target );
            }
        }

    } //if target && previous

}; //game_core.client_process_net_updates

game_core.prototype.client_onserverupdate_recieved = function(data){
    
        //Parse the server data
    data_parts = data.split('.')

    var inputs = data_parts[0].split('-');
    var time = data_parts[1].replace('-','.');
    var length = parseInt(data_parts[2]);
    
        //Store the server time (this is offset by the latency in the network, by the time we get it)
    this.server_time = parseFloat(time);
        //Update our local offset time from the last server update
    this.client_time = this.server_time - (this.net_offset/1000);

    for(var i = 0; i < length; i++){
        this.players.other.inputs.push(JSON.parse(inputs[i]));
    }

}; //game_core.client_onserverupdate_recieved

game_core.prototype.client_update_local_position = function(){

 if(this.client_predict) {

            //Work out the time we have since we updated the state
        var t = (this.local_time - this.players.self.state_time);

            //Then store the states for clarity,
        //var old_state = this.players.self.old_state.pos;
        //var current_state = this.players.self.cur_state.pos;

            //Make sure the visual position matches the states we have stored
        //this.players.self.pos = this.v_add( old_state, this.v_mul_scalar( this.v_sub(current_state,old_state), t )  );
        //this.players.self.pos = current_state;
        
            //We handle collision on client if predicting.
        this.check_collision( this.players.self );

    }  //if(this.client_predict)

}; //game_core.prototype.client_update_local_position

// client specific main update loop
game_core.prototype.client_update = function() {

        //Capture inputs from the player
    this.client_handle_input();

    this.process_input(this.players.other);
    this.process_input(this.players.self);

    // check if both players are ready
    if(this.start === false){
        if(this.players.self.ready === true && this.players.other.ready === true){
            this.start = true;
            this.snp_map.highlightLayer.initialize();
            this.initializePlayer(this.players.self);
            this.initializePlayer(this.players.other);  
        }
    }

        // draw the map
    this.client_redraw_map();

    //draw help/information if required
    this.client_draw_info();
    
    // clear the updates
    this.players.self.inputs = [];    
    this.players.other.inputs = [];

}; //game_core.update_client

game_core.prototype.create_timer = function(){
    setInterval(function(){
        this._dt = new Date().getTime() - this._dte;
        this._dte = new Date().getTime();
        this.local_time += this._dt/1000.0;
    }.bind(this), 4);
}


game_core.prototype.client_create_ping_timer = function() {

        //Set a ping timer to 1 second, to maintain the ping/latency between
        //client and server and calculated roughly how our connection is doing

    setInterval(function(){

        this.last_ping_time = new Date().getTime() - this.fake_lag;
        this.socket.send('p.' + (this.last_ping_time) );

    }.bind(this), 1000);
    
}; //game_core.client_create_ping_timer


game_core.prototype.client_create_configuration = function() {

    this.show_help = false;             //Whether or not to draw the help text
    //this.naive_approach = false;        //Whether or not to use the naive approach
    //this.show_server_pos = false;       //Whether or not to show the server position
    //this.show_dest_pos = false;         //Whether or not to show the interpolation goal
    //this.client_predict = true;         //Whether or not the client is predicting input
    //this.input_seq = 0;                 //When predicting client inputs, we store the last input as a sequence number
    //this.client_smoothing = true;       //Whether or not the client side prediction tries to smooth things out
    //this.client_smooth = 25;            //amount of smoothing to apply to client update dest

    this.net_latency = 0.001;           //the latency between the client and the server (ping/2)
    this.net_ping = 0.001;              //The round trip time from here to the server,and back
    this.last_ping_time = 0.001;        //The time we last sent a ping
    //this.fake_lag = 0;                //If we are simulating lag, this applies only to the input client (not others)
    //this.fake_lag_time = 0;

    this.net_offset = 100;              //100 ms latency between server and client interpolation for other clients
    this.buffer_size = 2;               //The size of the server history to keep for rewinding/interpolating.
    this.target_time = 0.01;            //the time where we want to be in the server timeline
    this.oldest_tick = 0.01;            //the last time tick we have available in the buffer

    this.client_time = 0.01;            //Our local 'clock' based on server time - client interpolation(net_offset).
    this.server_time = 0.01;            //The time the server reported it was at, last we heard from it
    
    this.dt = 0.016;                    //The time that the last frame took to run
    this.fps = 0;                       //The current instantaneous fps (1/this.dt)
    this.fps_avg_count = 0;             //The number of samples we have taken for fps_avg
    this.fps_avg = 0;                   //The current average fps displayed in the debug UI
    this.fps_avg_acc = 0;               //The accumulation of the last avgcount fps samples

    this.lit = 0;
    this.llt = new Date().getTime();

};//game_core.client_create_configuration

game_core.prototype.client_create_debug_gui = function() {

    this.gui = new dat.GUI();

    var _playersettings = this.gui.addFolder('Your settings');

        this.colorcontrol = _playersettings.addColor(this, 'color');

            //We want to know when we change our color so we can tell
            //the server to tell the other clients for us
        this.colorcontrol.onChange(function(value) {
            this.players.self.color = value;
            localStorage.setItem('color', value);
            this.socket.send('c.' + value);
        }.bind(this));

        _playersettings.open();

    var _othersettings = this.gui.addFolder('Methods');

        _othersettings.add(this, 'naive_approach').listen();
        _othersettings.add(this, 'client_smoothing').listen();
        _othersettings.add(this, 'client_smooth').listen();
        _othersettings.add(this, 'client_predict').listen();

    var _debugsettings = this.gui.addFolder('Debug view');
        
        _debugsettings.add(this, 'show_help').listen();
        _debugsettings.add(this, 'fps_avg').listen();
        _debugsettings.add(this, 'show_server_pos').listen();
        _debugsettings.add(this, 'show_dest_pos').listen();
        _debugsettings.add(this, 'local_time').listen();

        _debugsettings.open();

    var _consettings = this.gui.addFolder('Connection');
        _consettings.add(this, 'net_latency').step(0.001).listen();
        _consettings.add(this, 'net_ping').step(0.001).listen();

            //When adding fake lag, we need to tell the server about it.
        var lag_control = _consettings.add(this, 'fake_lag').step(0.001).listen();
        lag_control.onChange(function(value){
            this.socket.send('l.' + value);
        }.bind(this));

        _consettings.open();

    var _netsettings = this.gui.addFolder('Networking');
        
        _netsettings.add(this, 'net_offset').min(0.01).step(0.001).listen();
        _netsettings.add(this, 'server_time').step(0.001).listen();
        _netsettings.add(this, 'client_time').step(0.001).listen();
        //_netsettings.add(this, 'oldest_tick').step(0.001).listen();

        _netsettings.open();

}; //game_core.client_create_debug_gui

game_core.prototype.client_reset_positions = function() {

    // var player_host = this.players.self.host ?  this.players.self : this.players.other;
    // var player_client = this.players.self.host ?  this.players.other : this.players.self;

    //     //Host always spawns at the top left.
    // player_host.pos = { x:20,y:20 };
    // player_client.pos = { x:500, y:200 };

    //     //Make sure the local player physics is updated
    // this.players.self.old_state.pos = this.pos(this.players.self.pos);
    // this.players.self.pos = this.pos(this.players.self.pos);
    // this.players.self.cur_state.pos = this.pos(this.players.self.pos);

    //     //Position all debug view items to their owners position
    // this.ghosts.server_pos_self.pos = this.pos(this.players.self.pos);

    // this.ghosts.server_pos_other.pos = this.pos(this.players.other.pos);
    // this.ghosts.pos_other.pos = this.pos(this.players.other.pos);

}; //game_core.client_reset_positions

game_core.prototype.client_onreadygame = function(data) {

    var server_time = parseFloat(data.replace('-','.'));

    var player_host = this.players.self.host === true ?  this.players.self : this.players.other;
    var player_client = this.players.self.host === false  ?  this.players.other : this.players.self;

    this.local_time = server_time + this.net_latency;
    console.log('server time is about ' + this.local_time);

        //Update their information
    player_host.state = 'local_pos(hosting)';
    player_client.state = 'local_pos(joined)';

    this.players.self.state = 'YOU ' + this.players.self.state;

}; //client_onreadygame

game_core.prototype.client_onjoingame = function(data) {

        //We are not the host
    this.players.self.host = false;
    this.players.other.host = true;
        //Update the local state
    this.players.self.state = 'connected.joined.waiting';

}; //client_onjoingame

game_core.prototype.client_onhostgame = function(data) {

        //The server sends the time when asking us to host, but it should be a new game.
        //so the value will be really small anyway (15 or 16ms)
    var server_time = parseFloat(data.replace('-','.'));

        //Get an estimate of the current time on the server
    this.local_time = server_time + this.net_latency;

        //Set the flag that we are hosting, this helps us position respawns correctly
    this.players.self.host = true;
    this.players.other.host = false;

        //Update debugging information to display state
    this.players.self.state = 'hosting.waiting for a player';
    this.players.self.info_color = '#cc0000';

}; //client_onhostgame

game_core.prototype.client_onconnected = function(data) {

        //The server responded that we are now in a game,
        //this lets us store the information about ourselves and set the colors
        //to show we are now ready to be playing.
    this.players.self.id = data.id;
    this.players.self.state = 'connected';
    this.players.self.online = true;
}; //client_onconnected

game_core.prototype.client_on_otherclientcolorchange = function(data) {

    this.players.other.color = data;

}; //game_core.client_on_otherclientcolorchange

game_core.prototype.client_onping = function(data) {

    this.net_ping = new Date().getTime() - parseFloat( data );
    this.net_latency = this.net_ping/2;

}; //client_onping

game_core.prototype.client_onnetmessage = function(data) {

    var commands = data.split('.');
    var command = commands[0];
    var subcommand = commands[1] || null;
    var commanddata = commands[2] || null;

    switch(command) {
        case 's': //server message

            switch(subcommand) {

                case 'h' : //host a game requested
                    this.client_onhostgame(commanddata); break;

                case 'j' : //join a game requested
                    this.client_onjoingame(commanddata); break;

                case 'r' : //ready a game requested
                    this.client_onreadygame(commanddata); break;

                case 'e' : //end game requested
                    this.client_ondisconnect(commanddata); break;

                case 'p' : //server ping
                    this.client_onping(commanddata); break;

            } //subcommand

        break; //'s'
    } //command
                
}; //client_onnetmessage

game_core.prototype.client_ondisconnect = function(data) {
    
        //When we disconnect, we don't know if the other player is
        //connected or not, and since we aren't, everything goes to offline

    this.players.self.state = 'not-connected';
    this.players.self.online = false;
    this.start = false;

    this.players.other.state = 'not-connected';

}; //client_ondisconnect

game_core.prototype.client_connect_to_server = function() {
        
            //Store a local reference to our connection to the server
        this.socket = io.connect();

            //When we connect, we are not 'connected' until we have a server id
            //and are placed in a game by the server. The server sends us a message for that.
        this.socket.on('connect', function(){
            this.players.self.state = 'connecting';
        }.bind(this));

            //Sent when we are disconnected (network, server down, etc)
        this.socket.on('disconnect', this.client_ondisconnect.bind(this));
            //Sent each tick of the server simulation. This is our authoritive update
        this.socket.on('onserverupdate', this.client_onserverupdate_recieved.bind(this));
            //Handle when we connect to the server, showing state and storing id's.
        this.socket.on('onconnected', this.client_onconnected.bind(this));
            //On error we just show that we are not connected for now. Can print the data.
        this.socket.on('error', this.client_ondisconnect.bind(this));
            //On message from the server, we parse the commands and send it to the handlers
        this.socket.on('message', this.client_onnetmessage.bind(this));

}; //game_core.client_connect_to_server


game_core.prototype.client_refresh_fps = function() {

        //We store the fps for 10 frames, by adding it to this accumulator
    this.fps = 1/this.dt;
    this.fps_avg_acc += this.fps;
    this.fps_avg_count++;

        //When we reach 10 frames we work out the average fps
    if(this.fps_avg_count >= 10) {

        this.fps_avg = this.fps_avg_acc/10;
        this.fps_avg_count = 1;
        this.fps_avg_acc = this.fps;

    } //reached 10 frames

}; //game_core.client_refresh_fps


game_core.prototype.client_draw_info = function() {
    this.ctx.font = '14pt Calibri';
    this.ctx.fillStyle = 'white';
    
    //the game hasn't started yet
    
    if(this.start === false){
        this.ctx.fillText(this.players.self.state, (this.viewport.width / 2) - 20, (this.viewport.height / 2) - 10);
    }

    //the game has been won
    if(this.won){
        this.ctx.fillText("You Won!", (viewport.width / 2) - 20 , (viewport.height / 2)) - 10;
        this.ctx.fillText("Refresh to play again.", (viewport.width / 2) , (viewport.height / 2) + 20);
    }
    
    //the game has been lost
    if(this.lost){
        this.ctx.fillText("You Lost!", (viewport.width / 2) - 20 , (viewport.height / 2) - 10);
        this.ctx.fillText("Refresh to play again.", (viewport.width / 2) - 20, (viewport.height / 2) + 20);
    }

    this.ctx.fillText("You  $" + this.players.self.money, this.theMenu.moneyPos.x, this.theMenu.moneyPos.y);
    this.ctx.fillText("Them $" + this.players.other.money, this.theMenu.aiMoneyPos.x, this.theMenu.aiMoneyPos.y);
    this.ctx.fillText("Cost",  (this.wheatBut.column * this.tileHeight)  - this.theMenu.leftOff, (this.wheatBut.row  * this.tileWidth) - this.theMenu.upOff); 
    this.ctx.fillText("Pay",   (this.wheatBut.column * this.tileHeight) + this.theMenu.rightOff, (this.wheatBut.row  * this.tileWidth) - this.theMenu.upOff);
    this.ctx.fillText(this.Wheat.cost,      this.wheatBut.costX,    this.wheatBut.costY);  
    this.ctx.fillText(this.Wheat.payout,    this.wheatBut.payX,     this.wheatBut.payY);
    this.ctx.fillText(this.Corn.cost,       this.cornBut.costX,     this.cornBut.costY);
    this.ctx.fillText(this.Corn.payout,     this.cornBut.payX,      this.cornBut.payY); 
    this.ctx.fillText(this.Cherry.cost,     this.cherryBut.costX,   this.cherryBut.costY);
    this.ctx.fillText(this.Cherry.payout,   this.cherryBut.payX,    this.cherryBut.payY);
    this.ctx.fillText(this.baseBut.cost,    this.baseBut.costX,     this.baseBut.costY);
    this.ctx.fillText(this.protestBut.cost, this.protestBut.costX,  this.protestBut.cpstY);
    this.ctx.fillText(this.workerBut.cost,  this.workerBut.costX,   this.workerBut.costY);     
    
    this.ctx.fillText("YOU",  this.players.self.baseColumn * this.tileWidth, (this.players.self.baseRow * this.tileHeight) + this.theMenu.upOff);
        //They can hide the help with the debug GUI
    // if(this.show_help) {

    //     this.ctx.fillText('net_offset : local offset of others players and their server updates. Players are net_offset "in the past" so we can smoothly draw them interpolated.', 10 , 30);
    //     this.ctx.fillText('server_time : last known game time on server', 10 , 70);
    //     this.ctx.fillText('client_time : delayed game time on client for other players only (includes the net_offset)', 10 , 90);
    //     this.ctx.fillText('net_latency : Time from you to the server. ', 10 , 130);
    //     this.ctx.fillText('net_ping : Time from you to the server and back. ', 10 , 150);
    //     this.ctx.fillText('fake_lag : Add fake ping/lag for testing, applies only to your inputs (watch server_pos block!). ', 10 , 170);
    //     this.ctx.fillText('client_smoothing/client_smooth : When updating players information from the server, it can smooth them out.', 10 , 210);
    //     this.ctx.fillText(' This only applies to other clients when prediction is enabled, and applies to local player with no prediction.', 170 , 230);

    // } //if this.show_help

        //Draw some information for the host
    if(this.players.self.host) {

        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        this.ctx.fillText('YOU', this.players.self.baseRow , this.players.baseColumn);

    } //if we are the host


        //Reset the style back to full white.
    //this.ctx.fillStyle = 'rgba(255,255,255,1)';

}; //game_core.client_draw_help
