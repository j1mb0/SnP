/*  Copyright 2017 James "J1mb0" Schiffer
    
    written by : J1mb0
    written for : CS494 Final Project
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

        //Now the main game class. This gets created on
        //both server and client. Server creates one for
        //each game that is hosted, and client creates one
        //for itself to play the game.

/* The game_core class */
var game_core = function(game_instance){
    
        //Store the instance, if any
    this.instance = game_instance;
        //Store a flag if we are the server
    this.server = this.instance !== undefined;

    if (this.server){    
        require('./snp.map.js');
        require('./snp.player.js');
        require('./snp.protocol.js');
        game_map = global.game_map;
        aPlayer = global.aPlayer;
        Crop = global.Crop;
        atlasTiles = global.atlasTiles;
        snpProtocol = global.snpProtocol;
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
    this.game_over = false;

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
    
    this.Wheat    = new Crop(15000, 20000, 100, 50,     atlasTiles.wheat,   atlasTiles.wheatH,     this.wheatBut.row, this.wheatBut.column);      
    this.Corn     = new Crop(20000, 20000, 250, 100,    atlasTiles.corn,    atlasTiles.cornH,      this.cornBut.row, this.cornBut.column);
    this.Cherry   = new Crop(30000, 10000, 500, 200,    atlasTiles.cherry,  atlasTiles.cherryH,    this.cherryBut.row, this.cherryBut.column);
    this.EnWheat  = new Crop(10000, 30000, 50,  25,     atlasTiles.enWheat, atlasTiles.enWheatH,   this.wheatBut.row, this.wheatBut.column);    
    this.EnCorn   = new Crop(15000, 30000, 175, 75,     atlasTiles.enCorn,  atlasTiles.enCornH,    this.cornBut.row, this.cornBut.column);    
    this.EnCherry = new Crop(20000, 30000, 350, 150,    atlasTiles.enCherry,atlasTiles.enCherryH,  this.cherryBut.row, this.cherryBut.column);    

        //Client specific initialisation
    if(!this.server) {   
        
        //atlas image
        this.atlas = new Image();
        this.atlas.src="img/betatextures.png";

            //Create the default configuration settings
        this.client_create_configuration();

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

game_core.prototype.jsonifyUpdates = function(inputs){
    var jsonString = "";
    for(var i = 0; i < inputs.length; i++){
        update = inputs[i];
        jsonString += JSON.stringify(update);
        if(i != inputs.length - 1){
            jsonString += '-';
        } 
    }
    return jsonString;
};


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
    
    activate: function(baseBut, map){
        baseBut.isActive = true;
        var i = baseBut.row;
        var j = baseBut.column;
        
        map.highlightLayer.data[j][i] = atlasTiles.hightlight;
    },
    
    checkLoc: function(row, column, map){
        var check = true;
        for(var j = row; j <= row + 1; j++){
            for(var i = column; i <= column + 1; i++){
                if(map.secondLayer.data[j][i] !== atlasTiles.empty)
                {
                    check = false;
                }                
            }
        }
        return check;
    },
    
    place: function(row, column, baseBut, thePlayer, map){
        var check = this.checkLoc(row, column, map);
        
        if(check){
            map.secondLayer.data[row][column] = thePlayer.baseID1;
            map.placeableLayer.data[row][column] = atlasTiles.empty;
        
            map.secondLayer.data[row][column + 1] = thePlayer.baseID2;
            map.placeableLayer.data[row][column + 1] = atlasTiles.empty;
        
            map.secondLayer.data[row + 1][column] = thePlayer.baseID3;
            map.placeableLayer.data[row + 1][column] = atlasTiles.empty;
        
            map.secondLayer.data[row + 1][column + 1] = thePlayer.baseID4;
            map.placeableLayer.data[row + 1][column + 1] = atlasTiles.empty;
            
            baseBut.isActive = false;
            map.highlightLayer.data[baseBut.row][baseBut.column] = atlasTiles.empty;
            thePlayer.money -= baseBut.cost;
        }
    }
};

/************************* WORKER BUTTON SIMPLETON ************************************/
//activates player ai, basically hiring workers
game_core.prototype.worker = {
    activate: function(workerBut, thePlayer, map){
        var i = thePlayer.baseRow;
        var j = thePlayer.baseColumn;
        
        //thePlayer.money -= workerBut.cost;
        
        map.highlightLayer.data[workerBut.row][workerBut.column] = atlasTiles.hightlight;
        
        //thePlayer.canWork = true;
        
        setTimeout(function() {
            thePlayer.canWork = false;
            map.highlightLayer.data[workerBut.row][workerBut.column] = atlasTiles.empty;        
        }, workerBut.duration);
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
    player.initialize(this.Wheat, this.Corn, this.Cherry);
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
    if(row === thePlayer.crop1.buttonRow && column === thePlayer.crop1.buttonCol){
        thePlayer.curCrop = thePlayer.crop1;
        check = true;
    }
    if(row === thePlayer.crop2.buttonRow && column === thePlayer.crop2.buttonCol){
        thePlayer.curCrop = thePlayer.crop2;
        check = true;
    }
    if(row === thePlayer.crop3.buttonRow && column === thePlayer.crop3.buttonCol){
        thePlayer.curCrop = thePlayer.crop3;
        check = true;
    }
    if(row === this.protestBut.row && column === this.protestBut.column && thePlayer.money >= this.protestBut.cost)
    {
        // uhoh, this function is shared between client and server, can't figure out which player is which
        // var otherPlayer = (thePlayer.instance.userid == this.players.self.instance.userid) 
        //                   ? this.players.other : ();
        //this.Protest.activate(thePlayer);
        check = true;
    }
    if(row === this.baseBut.row && column === this.baseBut.column && thePlayer.money >= this.baseBut.cost)
    {
        this.BuildBase.activate(this.baseBut, this.snp_map);
        check = true;
    }
    if(row === this.workerBut.row && column === this.workerBut.column && thePlayer.money >= this.workerBut.cost){
        this.worker.activate(this.workerBut, thePlayer, this.snp_map);
        check = true;
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
        var butPress = this.clickButton(update.row, update.col, player);

        if(butPress){
            //why is this empty? I forget
            //clickButton will return true if the base button was clicked
            // so we don't process the input if a button was pressed, click button does all of that
        }
        else if(this.baseBut.isActive)
        {
            //if the base button is active, place a base
            this.BuildBase.place(update.row, update.col, this.baseBut, player, this.snp_map);
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
        thePlayer.ready = false;
        this.start = false;
        this.game_over = true;
        // reapply the original highlight layer (make backup at initialization and then switch to it)
        this.snp_map.reInitLayer(this.snp_map.highlightLayer, theRasters.highlightRaster);
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
                this.players.playerB.host = false;
            }
            else {
                this.players.playerB.host = true;
                this.players.playerA.host = false;
            }
            this.initializePlayer(this.players.playerA);
            this.initializePlayer(this.players.playerB);            
        }
    } 
    
    if (this.players.playerA.inputs.length > 0) // we have some new updates to send to clients
    {
        //Make a snapshot of the current state for player A and make a packet out of it
        var packetB = snpProtocol.createUpdateMsg(this.jsonifyUpdates(this.players.playerA.inputs), 
                                                  this.server_time.toFixed(3).replace('.','-'), 
                                                  this.players.playerA.inputs.length.toString());
        //Send the snapshot to playerB
        if(this.players.playerB.instance) {
            this.players.playerB.instance.send(packetB);
            console.log('server sending to B(' + this.players.playerB.instance.userid + ')  : ' + packetB);
        }
        // clear the updates
        this.players.playerA.inputs = [];
    }
        
    if(this.players.playerB.inputs.length > 0)
    {
        //Make a snapshot of the current state for playber B and make a packet out of it
        var packetA = snpProtocol.createUpdateMsg(this.jsonifyUpdates(this.players.playerB.inputs), 
                                                  this.server_time.toFixed(3).replace('.','-'), 
                                                  this.players.playerB.inputs.length.toString());
        //Send the snapshot to playerA
        if(this.players.playerA.instance) {
            this.players.playerA.instance.send(packetA);
            console.log('server sending to A(' + this.players.playerA.instance.userid + ')  : ' + packetA);    
        }
            // clear the updates
        this.players.playerB.inputs = [];
    }
}; //game_core.server_update

game_core.prototype.handle_server_input = function(client, inputs, sendTime, numInputs) {
    console.log('server recieved from ' + client.userid + ' : ' + inputs);

    // Fetch which client this refers to out of the two
    var player_client =
        (client.userid == this.players.playerA.instance.userid) ?
            this.players.playerA : this.players.playerB;

    // put each input command into the player's processing queue
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
    if(this.players.self.inputs.length) {
        //Send the packet of information to the server.
        var server_packet = snpProtocol.createUpdateMsg(this.jsonifyUpdates(this.players.self.inputs),
                                                        this.local_time.toFixed(3).replace('.','-'), 
                                                        this.players.self.inputs.length.toString());
        this.socket.send(server_packet);
    }
}; //game_core.client_handle_input

game_core.prototype.client_onserverupdate_recieved = function(data){
    //Parse the server data
    updateMsg = snpProtocol.parseUpdateData(data);
    
        //Store the server time (this is offset by the latency in the network, by the time we get it)
    this.server_time = parseFloat(updateMsg.time);
        //Update our local offset time from the last server update
    this.client_time = this.server_time - (this.net_offset/1000);

    for(var i = 0; i < updateMsg.length; i++){
        this.players.other.inputs.push(JSON.parse(updateMsg.updates[i]));
    }

}; //game_core.client_onserverupdate_recieved

// client specific main update loop
game_core.prototype.client_update = function() {

        //Capture inputs from the player
    this.client_handle_input();

    this.process_input(this.players.other);
    this.process_input(this.players.self);

    if (this.game_over == true)
    {
        this.players.self.ready = false;
        this.players.other.ready = false;
        this.socket.send(snpProtocol.end);
    }
    // check if both players are ready
    if(this.start === false){
        if(this.players.self.ready === true && this.players.other.ready === true){
            this.start = true;
            this.snp_map.highlightLayer.initialize();
            this.initializePlayer(this.players.self);
            this.initializePlayer(this.players.other);  
        }
    }

    // unhighlight all crops
    this.snp_map.highlightLayer.data[this.players.self.crop1.buttonRow][this.players.self.crop1.buttonCol] =  atlasTiles.empty;
    this.snp_map.highlightLayer.data[this.players.self.crop2.buttonRow][this.players.self.crop2.buttonCol] =  atlasTiles.empty;
    this.snp_map.highlightLayer.data[this.players.self.crop3.buttonRow][this.players.self.crop3.buttonCol] =  atlasTiles.empty;
    // highlight the selected crop
    this.snp_map.highlightLayer.data[this.players.self.curCrop.buttonRow][this.players.self.curCrop.buttonCol] =  atlasTiles.hightlight;
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
    //Set a ping timer to 1 second, to keep our connection alive
    //as well as keep an eye on connectivity
    setInterval(function(){
        this.last_ping_time = new Date().getTime();
        this.socket.send(snpProtocol.createMsg(snpProtocol.ping, this.last_ping_time));
    }.bind(this), 1000);
}; //game_core.client_create_ping_timer

game_core.prototype.client_create_configuration = function() {

    this.show_help = false;        

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

game_core.prototype.client_onreadygame = function(data) {

    var server_time = parseFloat(data.replace('-','.'));

    var player_host = this.players.self.host === true ?  this.players.self : this.players.other;
    var player_client = this.players.other.host === true  ?  this.players.self : this.players.other;

    this.local_time = server_time + this.net_latency;
    console.log('server time is about ' + this.local_time);

        //Update their information
    player_host.state = 'local_pos(hosting)';
    player_client.state = 'local_pos(joined)';
}; //client_onreadygame

game_core.prototype.client_onjoingame = function(data) {

        //We are not the host
    this.players.self.host = false;
    this.players.other.host = true;
        //Update the local state
    this.players.self.state = 'connected.joined.waiting';
    this.game_over = false;
    this.start = false;

    // reset all data
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

    this.game_over = false;
    this.start = false;
    
    // reset all data
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

}; //client_onhostgame

game_core.prototype.client_onconnected = function(data) {
    //The server responded that we are now in a game,
    //this lets us store the information about ourselves and set the colors
    //to show we are now ready to be playing.
    this.players.self.id = data;
    this.players.self.state = 'connected';
    this.players.self.online = true;
}; //client_onconnected

game_core.prototype.client_onping = function(data) {
    // we sent the time stored in data out
    // so we really are measuring the time from the original write to the server response recieved
    this.net_ping = new Date().getTime() - parseFloat( data );
    this.net_latency = this.net_ping/2;
}; //client_onping

game_core.prototype.client_onendgame = function(){
    game.start = false;    
}

game_core.prototype.client_onnetmessage = function(data) {

    var msg = snpProtocol.parseMsg(data);

    switch(msg.command) {
        case snpProtocol.host    :
            this.client_onhostgame(msg.commanddata);
            break;
        case snpProtocol.join    :
            this.client_onjoingame(msg.commanddata);    
            break;
        case snpProtocol.ready   :
            this.client_onreadygame(msg.commanddata); 
            break;
        case snpProtocol.end     :
            this.client_ondisconnect(msg.commanddata);;
            break;
        case snpProtocol.ping    :
            this.client_onping(msg.commanddata);
            break;
        case snpProtocol.update  :
            this.client_onserverupdate_recieved(msg.commanddata);
            break;
        case snpProtocol.correct :
            console.log("Correction command given by server");
            break;
        case snpProtocol.connect :
            this.client_onconnected(msg.commanddata);
            break;
        default:
            console.log("server sent me a bad command: " + command);
    } //command           
}; //client_onnetmessage

game_core.prototype.client_ondisconnect = function(data) {
    //When we disconnect, we don't know if the other player is
    //connected or not, and since we aren't, everything goes to offline
    this.players.self.state = 'not-connected';
    this.players.self.online = false;
    this.players.other.state = 'not-connected';
    this.start = false;
        
}; //client_ondisconnect

game_core.prototype.client_connect_to_server = function() {
    
    //Store a local reference to our connection to the server
    this.socket = io.connect();
    //When we connect, we are not 'connected' until we have a server id
    //and are placed in a game by the server. The server sends us a message for that
    this.socket.on('connect', function() {
        this.players.self.state = 'connecting';
    }.bind(this));

    //this.socket.on('timeout', this.client_ondisconnect.bind(this));
    //Sent when we are disconnected (network, server down, etc)
    this.socket.on('disconnect', this.client_ondisconnect.bind(this));
    //On error we just show that we are not connected for now.
    this.socket.on('error', this.client_ondisconnect.bind(this));
    //On message from the server, we parse the commands and send it to the handlers
    this.socket.on('message', this.client_onnetmessage.bind(this));
}; //game_core.client_connect_to_server

game_core.prototype.client_draw_info = function() {
    this.ctx.font = '14pt Calibri';
    this.ctx.fillStyle = 'white';
    
    //the game hasn't started yet
    
    if(this.start === false && this.game_over == false){
        this.ctx.fillText(this.players.self.state, (this.viewport.width / 2) - 20, (this.viewport.height / 2) - 10);
    }

    //the game has been won
    if(this.players.self.won == true && this.game_over == true){
        this.ctx.fillText("You Won!", (viewport.width / 2) - 20 , (viewport.height / 2)) - 10;
        this.ctx.fillText("Joining another game.", (viewport.width / 2) , (viewport.height / 2) + 20);
        this.ctx.fillText(this.players.self.state, (viewport.width / 2) , (viewport.height / 2) + 50);        
    }
    
    //the game has been lost
    if(this.players.self.won == false && this.game_over == true){
        this.ctx.fillText("You Lost!", (viewport.width / 2) - 20 , (viewport.height / 2) - 10);
        this.ctx.fillText("Joining another game.", (viewport.width / 2) - 20, (viewport.height / 2) + 20);
        this.ctx.fillText(this.players.self.state, (viewport.width / 2) , (viewport.height / 2) + 50);
    }

    this.ctx.fillText("You  $" + this.players.self.money, this.theMenu.moneyPos.x, this.theMenu.moneyPos.y);
    this.ctx.fillText("Them $" + this.players.other.money, this.theMenu.aiMoneyPos.x, this.theMenu.aiMoneyPos.y);
    this.ctx.fillText("Cost",  (this.wheatBut.column * this.tileHeight)  - this.theMenu.leftOff, (this.wheatBut.row  * this.tileWidth) - this.theMenu.upOff); 
    this.ctx.fillText("Pay",   (this.wheatBut.column * this.tileHeight) + this.theMenu.rightOff, (this.wheatBut.row  * this.tileWidth) - this.theMenu.upOff);
    this.ctx.fillText(this.players.self.crop1.cost,      this.wheatBut.costX,    this.wheatBut.costY);  
    this.ctx.fillText(this.players.self.crop1.payout,    this.wheatBut.payX,     this.wheatBut.payY);
    this.ctx.fillText(this.players.self.crop2.cost,      this.cornBut.costX,     this.cornBut.costY);
    this.ctx.fillText(this.players.self.crop2.payout,    this.cornBut.payX,      this.cornBut.payY); 
    this.ctx.fillText(this.players.self.crop3.cost,      this.cherryBut.costX,   this.cherryBut.costY);
    this.ctx.fillText(this.players.self.crop3.payout,    this.cherryBut.payX,    this.cherryBut.payY);
    this.ctx.fillText(this.baseBut.cost,    this.baseBut.costX,     this.baseBut.costY);
    this.ctx.fillText(this.protestBut.cost, this.protestBut.costX,  this.protestBut.cpstY);
    this.ctx.fillText(this.workerBut.cost,  this.workerBut.costX,   this.workerBut.costY);     
    
    this.ctx.fillText("YOU",  this.players.self.baseColumn * this.tileWidth, (this.players.self.baseRow * this.tileHeight) + this.theMenu.upOff);

    //Draw some information for the host, so they know where their base is
    if(this.players.self.host) {
        this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
        this.ctx.fillText('YOU', this.players.self.baseRow , this.players.baseColumn);
    } //if we are the host

}; //game_core.client_draw_help
