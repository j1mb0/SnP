/*  Copyright 2017 James "J1mb0" Schiffer
    
    written by : J1mb0
    written for : CS494 Final Project
    Usage : node app.js
*/

	//A window global for our game root variable.
var game = {};

	//When loading, we store references to our
	//drawing canvases, and initiate a game instance.
window.onload = function(){

		//Create our game client instance.
	game = new game_core();

		//Fetch the viewport
	game.viewport = document.getElementById('viewport');
		
		//Adjust their size
	game.viewport.width = game.world.width;
	game.viewport.height = game.world.height;

		//Fetch the rendering contexts
	game.ctx = game.viewport.getContext('2d');

		//Set the draw style for the fontg
	game.ctx.font = '11px "Helvetica"';

	//get clicks
	//!!!!!Works with scrolling, but window.scroll is not a recommended function
	//for maximum compatibility. 
	game.viewport.addEventListener('click', function(e){
		
		//!!!!figure out a different way of dealing with scrolling
		//!!!!that is more compatiable 
		var posx = event.clientX - game.viewport.offsetLeft + scrollX; 
		var posy = event.clientY - game.viewport.offsetTop + scrollY;
			
		//deal with the click
		game.client_process_click(posx, posy);
		//console.log("(", e.pagex, ", ", e.posx, ")"); 
	
	}, false);
	
		//Finally, start the loop
	game.update( new Date().getTime() );

}; //window.onload