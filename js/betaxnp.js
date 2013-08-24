/**********************************************canvas************************************************/

//these must be able to go somewhere else
var tileHeight = 50;
var tileWidth = 50; 
var gridWidth = 24;
var gridHeight = 14;

var atlasWidth = 20;

//get canvas object
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//set dimensions of canvas
canvas.width = gridWidth * tileHeight;
canvas.height = gridHeight * tileHeight;

//attach the canvas to the body (the page)
document.body.appendChild(canvas);


/*******************************************Resources***********************************************/
var succesfullyDraw = false;

//atlas image
//var atlasReady = false;
var atlas = new Image();
atlas.onload = function() {
    //alert("everything is fine.")
    main();
};
atlas.src="img/betatextures.png";

//this is a struct of ints, relating to tile ids.
//this is a fix (maybe not a good one) for how
//everything would break when the atlas changes.
var atlasTiles = {
    empty : -1, 
    pBase1 : 24, pBase2: 25, pBase3: 44, pBase4: 45,
    hightlight: 6, seeds: 129, seedBut: 130, 
    enBase1: 21, enBase2: 22,
    enBase3: 41, enBase4: 43, wheat: 180, 
    wheatH: 183, protest: 27, 
    enWheat: 181, enWheatH: 182, tree: 136,
    wasted: 136, baseBut: 26, workerBut: 128,
    cherry: 13, cherryH: 16, enCherry: 14,
    enCherryH: 15, corn: 17, cornH: 20,
    enCorn: 18, enCornH: 19, ladybug: 123,
    lawsuit: 124
    
};


//this is a function, but it's only purpose is to made 
//2d arrays, so it's here.
//!!!! TRY TO FIND A BETTER PLACE FOR THIS
function make2d(){
        var layer = new Array(gridHeight);
        for (var j = 0; j < gridHeight; j++) {
            layer[j] = new Array(gridWidth);
        }
        
        return layer;
}


/*******************************Events*************************************/
//!!!!!Figure out how to get a function (object) call 
//into the second parameter of addEventLister

//get clicks
//!!!!!Works with scrolling, but window.scroll is not a recommended function
//for maximum compatibility. 
canvas.addEventListener('click', function(e){
        
        //console.log("(", window.scrollX, ", ", window.scrollY, ")");
        
        //!!!!figure out a different way of dealing with scrolling
        //!!!!that is more compatiable 
       var posx = event.clientX - canvas.offsetLeft + window.scrollX; 
       var posy = event.clientY - canvas.offsetTop + window.scrollY;
       
       //if the user clicks for the first time, 
       //clear the start screen and start the game
       if(Game.start === false){
           Game.start = true;
           init2dArray(theMap.highlightLayer);
       }
        
       //deal with the click
       Game.tileClick(posx, posy);
       //console.log("(", e.pagex, ", ", e.posx, ")"); 
       
    }, false);
    
/*********************************CROPS CLASS********************************/
function Crop(payoutPeriod, wastePeriod, payout, cost, growID, harvID){
    this.payoutPeriod = payoutPeriod; //time it takes to grow a crop
    this.payout = payout;             //the money you get from a crop
    this.wastePeriod = wastePeriod;   //how long before the crop goes bad
    this.cost = cost;                 //the cost to plant the crop
    this.growID = growID;             //the texture of the growing crop
    this.harvID = harvID;             //the texture of the harvestable crop
    
    //checks if a tile doesn't have a growing or harvestable crop
    //returns true if there isn't any.
    this.HasNoCrop = function(row, column){
        var check = (theMap.placeableLayer[column][row] != this.growID 
                        && theMap.placeableLayer[column][row] != this.harvID);
        
        return check;
    }
}

//*******************************CROP OBJECTS**********************************/
var Wheat = new Crop(15000, 20000, 100, 50, atlasTiles.wheat, atlasTiles.wheatH);
var Corn = new Crop(20000, 20000, 100, 200, atlasTiles.corn, atlasTiles.cornH);
var Cherry = new Crop(30000, 10000, 200, 500, atlasTiles.cherry, atlasTiles.cherryH);
var EnWheat = new Crop(15000, 20000, 100, 50, atlasTiles.enWheat, atlasTiles.enWheatH);
var EnCorn = new Crop(20000, 20000, 100, 200, atlasTiles.enCorn, atlasTiles.enCornH);
var EnCherry = new Crop(30000, 10000, 200, 500, atlasTiles.enCherry, atlasTiles.enCherryH);

/***************************************GAME SIMPLETON****************************/
//this has functions related to the mechanics and engine of the game
var Game = {
    start: false,
    won: false,
    lost: false,
    
    //runs the game
    run: function(){
       if(Game.start){

            PlayerDriver.execute(theAI);

            PlayerDriver.execute(thePlayer);

       }
    },
    
    //gets a row index (i) from a x position
    getRowCol: function (x, y){
    
    //get row
    var row = x / tileWidth;
    var column = y / tileHeight;
    
    //round it down
    row = Math.floor(row);
    column = Math.floor(column);
    
    return {"row": row, "column": column};
    },
    
    //is called by click event
    //this will calculate the row and column of the click,
    //and update the drawing map (placeableLayer) accordingly
    tileClick: function(x, y){
        //get the row and column
        var position = Game.getRowCol(x, y);
        
        //check if a button was pressed or not
        var butPress = theMenu.clickButton(position.row, position.column);
        
        //
        if(butPress){
            
        }
        else if(baseBut.isActive)
        {
            BuildBase.place(position.row, position.column);
        } 
        else 
        {
            PlayerDriver.canPlant(position.row, position.column, thePlayer, Wheat);
        }
        
    },
    
    //redraws the placeableLayer, or the map layer with placeable tiles.
    iterate: function(){
        if(succesfullyDraw){
            
            Game.redrawMap();
            
            ctx.font = '14pt Calibri';
            ctx.fillStyle = 'white';
            
            Game.UpdateStatus();
                            
            
            ctx.fillText("You  $" + thePlayer.money, theMenu.moneyPos.x, theMenu.moneyPos.y);
            ctx.fillText("Them $" + theAI.money, theMenu.aiMoneyPos.x, theMenu.aiMoneyPos.y);
            
            ctx.fillText("Cost", (wheatBut.row * tileWidth) - theMenu.leftOff, (wheatBut.column * tileHeight) - theMenu.upOff);
            ctx.fillText("Pay", (wheatBut.row * tileWidth) + theMenu.rightOff, (wheatBut.column * tileHeight) - theMenu.upOff);
            
            ctx.fillText(wheatBut.cost, (wheatBut.row * tileWidth) - theMenu.leftOff, (wheatBut.column * tileHeight));
            ctx.fillText(wheatBut.payout, (wheatBut.row * tileWidth) + theMenu.rightOff, (wheatBut.column * tileHeight));
            
            ctx.fillText(cornBut.cost, (cornBut.row * tileWidth) - theMenu.leftOff, (cornBut.column * tileHeight));
            ctx.fillText(cornBut.payout, (cornBut.row * tileWidth) + theMenu.rightOff, (cornBut.column * tileHeight));
            
            ctx.fillText(cherryBut.cost, (cherryBut.row * tileWidth) - theMenu.leftOff, (cherryBut.column * tileHeight));
            ctx.fillText(cherryBut.payout, (cherryBut.row * tileWidth) + theMenu.rightOff, (cherryBut.column * tileHeight));
            
            ctx.fillText(baseBut.cost, (baseBut.row * tileWidth) - theMenu.leftOff, (baseBut.column * tileHeight));
            ctx.fillText(baseBut.payout, (baseBut.row * tileWidth) + theMenu.rightOff, (baseBut.column * tileHeight));
            
            ctx.fillText(protestBut.cost, (protestBut.row * tileWidth) - theMenu.leftOff, (protestBut.column * tileHeight));
            ctx.fillText(protestBut.payout, (protestBut.row * tileWidth) + theMenu.rightOff, (protestBut.column * tileHeight));
            
            ctx.fillText(workerBut.cost, (workerBut.row * tileWidth) - theMenu.leftOff, (workerBut.column * tileHeight));
            ctx.fillText(workerBut.payout, (workerBut.row * tileWidth) + theMenu.rightOff, (workerBut.column * tileHeight));
        }
    },
    
    //checks the general status of the game.
    UpdateStatus: function(){
        
        //the game hasn't started yet
        if(Game.start === false && Game.won === false
            && Game.lost === false){
            ctx.fillText("Click to Start", (canvas.width / 2) - 20, (canvas.height / 2) - 10);
        }
        
        //the game has been won
        if(Game.won){
            ctx.fillText("You Won!", (canvas.width / 2) - 20 , (canvas.height / 2)) - 10;
            ctx.fillText("Refresh to play again.", (canvas.width / 2) , (canvas.height / 2) + 20);
        }
        
        //the game has been lost
        if(Game.lost){
            ctx.fillText("You Lost!", (canvas.width / 2) - 20 , (canvas.height / 2) - 10);
            ctx.fillText("Refresh to play again.", (canvas.width / 2) - 20, (canvas.height / 2) + 20);
        }
        
        //check if the game has been one or lost
        if(thePlayer.money >= thePlayer.toWin){
            Game.won = true;
            Game.start = false;
            parseRaster(theRasters.highlightRaster, theMap.highlightLayer);
            
            //alert("You win!");
        }
        else if(theAI.money >= theAI.toWin){
            Game.lost = true;
            Game.start = false;
            parseRaster(theRasters.highlightRaster, theMap.highlightLayer);
            //alert("You lose!");
        }
    },
    
    //redraws the map, layer by layer
    redrawMap: function (){
        mapDoes.drawMap(theMap.baseLayer);
        mapDoes.drawMap(theMap.firstLayer);
        mapDoes.drawMap(theMap.secondLayer);
        mapDoes.drawMap(theMap.placeableLayer);
        mapDoes.drawMap(theMap.buttonLayer);
        mapDoes.drawMap(theMap.frameLayer);
        mapDoes.drawMap(theMap.highlightLayer); 
    }
};

/****************************PLAYER CLASS*************************/
function aPlayer(crop1, crop2, crop3, isEnemy){
    this.toWin = 5000;
    this.activeCrops = 0;
    this.money = 3000;
    this.isEnemy = isEnemy; 
    this.baseID1 = atlasTiles.pBase1;
    this.baseID2 = atlasTiles.pBase2;
    this.baseID3 = atlasTiles.pBase3;
    this.baseID4 = atlasTiles.pBase4;   
    
    this.baseRow = -1;
    this.baseColumn = -1;
    this.crop1 = crop1;
    this.crop2 = crop2;
    this.crop3 = crop3;
    this.speed = 400;
    
    this.canWork = false;
    
    this.findBase = function(){
        var loc = mapDoes.searchLayer(theMap.secondLayer, this.baseID1);
        this.baseRow = loc.row;
        this.baseColumn = loc.col;
        
        if(this.isEnemy === true){
            this.canWork = true;
        }
    };
    
    this.IsNoCropAt = function(row, column){
        var check = false;
        
        check = (crop1.HasNoCrop(row, column, this)
                    && crop2.HasNoCrop(row, column, this)
                    && crop3.HasNoCrop(row, column, this));
        
        return check;
        
    };
    
    this.getCrop = function(theTile)
    {
        var i = theTile.row;
        var j = theTile.column;
        
        
        if(theMap.placeableLayer[j][i] == this.crop1.harvID)
        {
            theCrops.cropYield(crop1, this, false);
        }
        
        if(theMap.placeableLayer[j][i] == this.crop2.harvID)
        {
            theCrops.cropYield(crop2, this, false);
        }
        
        if(theMap.placeableLayer[j][i] == this.crop3.harvID)
        {
            theCrops.cropYield(crop3, this, false);
        }
    };
}

/***************************PLAYER OBJECTS**********************/
var thePlayer = new aPlayer(Wheat, Corn, Cherry, false);
var theAI = new aPlayer(EnWheat, EnCorn, EnCherry, true);
theAI.baseID1 = atlasTiles.enBase1;
theAI.baseID2 = atlasTiles.enBase2;
theAI.baseID3 = atlasTiles.enBase3;
theAI.baseID4 = atlasTiles.enBase4;



//****************************PLAYER DRIVER SIMPLETON***********************/
//a collection of functiosn to be preformed upon players, ai or human.
var PlayerDriver = {
    
    isPBase: function(row, column, player){
        var check = false;
        
        if(theMap.secondLayer[column][row] == player.baseID1)
        {
            check = true;
        }
        
        if(theMap.secondLayer[column][row] == player.baseID2)
        {
            check = true;
        }
        
        if(theMap.secondLayer[column][row] == player.baseID3)
        {
            check = true;
        }
        
        if(theMap.secondLayer[column][row] == player.baseID4)
        {
            check = true;
        }

        return check;
        
    },
    
    canPlant: function(row, column, player, crop){
            //update the layer and trigger events.
            
        var check = (theCrops.canGrowCrops(row, column, player) && player.money >= crop.cost);
        
        if(check){
            PlayerDriver.plant(row, column, player, crop);
            
        } else if(theMap.placeableLayer[column][row] == crop.harvID){
            PlayerDriver.harvest(theMap.idLayer[column][row], player);
        }
    },
    
     //that AI just loves harvesting,
    //cause it makes him money
    harvest: function(theTile, player){
        
        player.getCrop(theTile);
        theMap.placeableLayer[theTile.column][theTile.row] = atlasTiles.empty;
        mapDoes.clearID(theMap.idLayer[theTile.column][theTile.row]);
        
        //console.log("attempting to harvest: " + theTile.row + " " + theTile.column);;
    },
    
    //plant a crop
    plant: function(row, column, player, crop){
        player.activeCrops++;
        theCrops.cropPlant(crop, player);
        theMap.placeableLayer[column][row] = crop.growID;
        mapDoes.generateID(theMap.idLayer[column][row], crop);
        var id = theMap.idLayer[column][row].tileID;
        theMap.idLayer[column][row].tileType = crop.growID;
        setTimeout(function() {
            theMap.placeableLayer[column][row] = crop.harvID;
            theMap.idLayer[column][row].tileType = crop.harvID;
            
            setTimeout(function()
            {
                
                theCrops.wasteCrop(row, column, id);
                
            }, crop.wastePeriod);
        
        }, crop.payoutPeriod);
    },
    
    canHarvest: function(theTile, player){
        var check = false;
        var i = theTile.row;
        var j = theTile.column;
        
        if(theMap.placeableLayer[j][i] == player.crop1.harvID 
            || theMap.placeableLayer[j][i] == player.crop2.harvID
            || theMap.placeableLayer[j][i] == player.crop3.harvID) 
        {
                
                check = true;
            
        }
        
        return check;
    },
    
    //moves a tile randomly, so randomly it might not move it at all
    moveTile: function(theTile){
    
        //get if the tile moves right or left
        //randomize three movements:
        //0 move left, 1 move right, 2 do nothing
        
        var seed = Math.floor(Math.random()*3); //get random from 0-2
        
        //0 move left
        if(seed === 0 && theTile.row > 0){
            theTile.row--;
        }
        
        //1 move right
        if(seed === 1 && theTile.row < gridWidth) {
            theTile.row++;
        }
        
        //get if the tile moves up or down
        //randomize three movements
        //0 move down, 1 move up, 2 do nothing
        seed = Math.floor(Math.random()*3); //get another random from 0-2
        
        //0 move down
        if(seed === 0 && theTile.column > 0){
            theTile.column--;
        }
        
        //1 move up
        if(seed === 1 && theTile.column < gridHeight) {
            theTile.column++;
        }
    },
    
    //searches for a tile that is either
    //plantable or harvestable
    //pretty nice little bit of recursion, if I don't say so myself *smug face*
    search: function(theTile, cap, player){
        
        //if the AI can plant there, it plants
        if(theCrops.canGrowCrops(theTile.row, theTile.column, player) 
            && player.money >= Wheat.cost)
        {
            
            PlayerDriver.plant(theTile.row, theTile.column, player, player.crop1);
            
        } 
        else if(PlayerDriver.canHarvest(theTile, player))
        {
            //otherwise, it checks if it can harvest something
            PlayerDriver.harvest(theTile, player);
            
        }
        else 
        {
            //otherwise, the recursive bit. 
            //First randomly move the tile
            PlayerDriver.moveTile(theTile);
            
            cap--;
            
            //then repeat this step
            if(cap > 0){
                PlayerDriver.search(theTile, cap, player);
            }
        }
        
    },
    
       
    //the AI, just like Rick Ross, likes to hustle.
    //this is what it does, as fast as it can.
    execute: function(player){
        
        if(player.canWork)
        {
            //makes a tile to hold the move's action
            var theTile = new aTile();
            theTile.row = player.baseRow;
            theTile.column = player.baseColumn;
           
            //searches for a place to plant or harvest
            PlayerDriver.search(theTile, 10, player);
        }
    } 
    
};



//******************************TILE CLASS**************************************/
function aTile(){
    this.row = -1;
    this.column = -1;
    this.canHarvest = false;
    this.tileType = -1;
    this.tileID = -1; 
}


/*********************************************RASTERS CLASS***************************************/
//I could'nt figure out json files, so I decided to parse the data myself
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

}

//Since the JSON gives us a raster array of int values, we need to convert it into
 // a corresponding 2d array. 
function parseRaster(theRaster, the2dArray){
    //for going through the raster
    var k = 0;
    
    //controls columns
    for(var j = 0; j <= gridHeight - 1; j++){
        
        //controls rows
        for(var i = 0; i <= gridWidth - 1 ; i++){
            
            //copies it over
            the2dArray[j][i] = theRaster[k] - 1;
            k++;
        }
    }    
}

//initializes a 2d array to -1, basically undrawable tiles
function init2dArray(the2dArray){
    
    //columns
    for(var j = 0; j <= gridHeight - 1; j++){
        
        //rows
        for(var i = 0; i <= gridWidth - 1; i++){
            the2dArray[j][i] = atlasTiles.empty;
            //console.log(mapData[i][j]);
        }
    }
}



//this function will render the map.
function render(){
    
        //prepare + draw base layer
        theMap.baseLayer = make2d();
        parseRaster(theRasters.baseRaster, theMap.baseLayer);
        
        //prepare + draw first layer 
        theMap.firstLayer = make2d();
        parseRaster(theRasters.firstRaster, theMap.firstLayer);
        
        //prepare + draw second layer   
        theMap.secondLayer = make2d();
        parseRaster(theRasters.secondRaster, theMap.secondLayer);
        
        //initialize placeable layer
        //init2dArray(placeableLayer);
        theMap.placeableLayer = make2d();
        parseRaster(theRasters.placeablesRaster, theMap.placeableLayer);
       
        //draw the menu
        theMap.buttonLayer = make2d();
        parseRaster(theRasters.buttonRaster, theMap.buttonLayer);
        
        theMap.frameLayer = make2d();
        parseRaster(theRasters.frameRaster, theMap.frameLayer);
        
        theMap.highlightLayer = make2d();
        parseRaster(theRasters.highlightRaster, theMap.highlightLayer);
        
        theMap.idLayer = mapDoes.make2dTiles();
        
        Game.redrawMap();
        
        //init2dArray(theMap.highlightLayer);
        
        succesfullyDraw = true;
}

/**********************************THE MAP SIMPLETON**************************/
//this holds functions related to the map
var mapDoes = {
    
    //draws the map. Takes in an 2d array of integer values and prints out the corresponding tile
    drawMap: function(the2dArray, map){
    
        //outside is the columns
        for(var j = 0; j <= gridHeight - 1; j++){
        
            // inside is the rows
            for(var i = 0; i <= gridWidth - 1; i++){
                
                //every value above -1 is a tile to be drawn
                if(the2dArray[j][i] > atlasTiles.empty){
                    var x = (the2dArray[j][i] % atlasWidth) * tileWidth;
                    var y = the2dArray[j][i]; 
                    y = (Math.floor(y / atlasWidth)); 
                    y *= tileHeight;
                    
                    //an overload of draw image
                    ctx.drawImage(atlas, x, y, tileWidth, tileHeight, 
                                    i * tileWidth, j * tileHeight, tileWidth, tileHeight);
                }
                //console.log(mapData[i][j]);
            }
        }
    },
    
    //Searches for an tile ID
    searchLayer: function(the2dArray, tileID){
        var loci = -1;
        var locj = -1;
        
        for(var j = 0; j <= gridHeight - 1; j++){
            for(var i = 0; i <= gridWidth - 1; i++){
                if(the2dArray[j][i] == tileID){
                    loci = i;
                    locj = j;
                }
                //console.log(mapData[i][j]);
            }
        }
        
        return {row: loci, col: locj};
    },
    
    make2dTiles: function(){
        var layer = new Array(gridHeight);
        for (var j = 0; j < gridHeight; j++) {
            layer[j] = new Array(gridWidth);
            for(var i = 0; i < gridWidth; i++){
                layer[j][i] = new aTile();
                layer[j][i].tileID = -1;
                layer[j][i].row = i;
                layer[j][i].column = j;
            }
        }
        return layer;
    },
    
    generateID: function(theTile){
        theTile.tileID = Math.floor(Math.random()*10001);     
    },
    
    clearID: function(theTile){
        theTile.tileID = -1; 
        theTile.tileType = -1;
    }
};


/**************************************MAP CLASS******************************/
//takes in a raster so that multiple maps could be implemented in future
function aMap(){
    //this.tileWidth =  aRaster.tileWidth;
    //this.tileHeight = aRaster.tileHeight;
    //this.gridWidth = aRaster.gridWidth;
   // this.gridHeight = aRaster.gridHeight;

    //for the grass and stuff
    this.baseLayer;
    
    //hills and water n stuff
    //these won't be modified ever
    //it does contain the base, and
    //is used to check base location
    this.firstLayer;
    
    //adding another layer of
    // terrain
    this.secondLayer;
    
    //placeables
    this.placeableLayer;
    
    //menu
    this.buttonLayer;
    
    //frames for buttons;
    this.frameLayer;
    
     //for highlight effect on mouseover
    this.highlightLayer;
    
    this.idLayer;
}

//***********************************MAP OBJECTS******************************/
var theMap = new aMap();



//********************************MENU BUTTON SIMPLETON************************/
//Hold's functions and details for the menu
var theMenu = {
    moneyPos: {x: 20, y: 40},
    aiMoneyPos: {x: 20, y: 80},
    leftOff: 25,
    rightOff: 75,
    upOff: 25,
    
    
    
    //this checks if a button was pressed
    clickButton: function(row, column){
        var check = false;
        if(row == protestBut.row && column == protestBut.column && thePlayer.money >= protestBut.cost)
        {
            Protest.activate();
        }
        if(row == baseBut.row && column == baseBut.column && thePlayer.money >= baseBut.cost)
        {
            BuildBase.activate();
            check = true;
        }
        if(row == workerBut.row && column == workerBut.column && thePlayer.money >= workerBut.cost){
            worker.activate();
        }
        
        return check;
    }
};

/************************************BUTTON CLASS*************************************************/
function Button(id, cost, duration){
    this.row = -1;
    this.column = -1;
    this.id = id;
    this.cost  = cost;
    this.duration = duration;
    this.isActive = false;
    
    this.findLoc = function(){
        var loc = mapDoes.searchLayer(theMap.buttonLayer, this.id);
        this.row = loc.row;
        this.column = loc.col;
    }
}

/************************************BUTTON OBJECTS**********************************************/
var wheatBut = new Button(atlasTiles.wheat, -1, -1);
var cornBut = new Button(atlasTiles.corn, -1, -1);
var cherryBut = new Button(atlasTiles.cherry, -1, -1);
var protestBut = new Button(atlasTiles.protest, 200, 15000);
var ladybugBut = new Button(atlasTiles.ladybug, 25, -1);
var baseBut = new Button(atlasTiles.baseBut, 500, -1);
var workerBut = new Button(atlasTiles.workerBut, 75, 15000);

/*************************************PROTEST BUTTON DRIVER SIMPLETON****************************/

var Protest = {
    
    activate: function(){
        thePlayer.money -= protestBut.cost;
        theAI.canWork = false;
        
        theMap.highlightLayer[protestBut.column][protestBut.row] = atlasTiles.hightlight;
        theMap.highlightLayer[theAI.baseColumn][theAI.baseRow] = atlasTiles.protest;
        
        setTimeout(function() {
            theAI.canWork = true;
        
            theMap.highlightLayer[protestBut.column][protestBut.row] = atlasTiles.empty;
            theMap.highlightLayer[theAI.baseColumn][theAI.baseRow] = atlasTiles.empty;
        
        }, protestBut.duration);
        
    }
};

/***************************BUTTON TO BUILD BASE SIMPLETON*********************/
  var BuildBase = {
      
      activate: function(){
          baseBut.isActive = true;
          var i = baseBut.row;
          var j = baseBut.column;
          
          theMap.highlightLayer[j][i] = atlasTiles.hightlight;
          
      },
      
      checkLoc: function(row, column){
          var check = true;
          
          
          for(var j = column - 1; j <= column + 1; j++){
              for(var i = row - 1; i <= row + 1; i++){
                  
                  if(theMap.secondLayer[j][i] != atlasTiles.empty)
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
              theMap.secondLayer[column][row] = atlasTiles.pBase1;
              //theMap.secondLayer[column][row] = atlasTiles.empty;
              theMap.placeableLayer[column][row] = atlasTiles.empty;
              
              theMap.secondLayer[column][row + 1] = atlasTiles.pBase2;
              //theMap.secondLayer[column][row + 1] = atlasTiles.empty;
              theMap.placeableLayer[column][row + 1] = atlasTiles.empty;
              
              theMap.secondLayer[column + 1][row] = atlasTiles.pBase3;
              //theMap.secondLayer[column + 1][row] = atlasTiles.empty;
              theMap.placeableLayer[column + 1][row] = atlasTiles.empty;
              
              theMap.secondLayer[column + 1][row + 1] = atlasTiles.pBase4;
              //theMap.secondLayer[column + 1][row + 1] = atlasTiles.empty;
              theMap.placeableLayer[column + 1][row + 1] = atlasTiles.empty;
              
              
              baseBut.isActive = false;
              theMap.highlightLayer[baseBut.column][baseBut.row] = atlasTiles.empty;
              thePlayer.money -= baseBut.cost;
          }
      }
  };
  
  /************************* WORKER BUTTON SIMPLETON ************************************/
  //activates player ai, basically hiring workers
  var worker = {
      activate: function(){
          var i = thePlayer.baseRow;
          var j = thePlayer.baseColumn;
          
          thePlayer.money -= workerBut.cost;
          
          theMap.highlightLayer[workerBut.column][workerBut.row] = atlasTiles.hightlight;
          
          thePlayer.canWork = true;
          
          setTimeout(function() {
              thePlayer.canWork = false;
          
              theMap.highlightLayer[workerBut.column][workerBut.row] = atlasTiles.empty;
              
          
          }, workerBut.duration);
          
      }
  };
  
  /*********************************CROPS CLASS********************************/
  function Crop(payoutPeriod, wastePeriod, payout, cost, growID, harvID){
      this.payoutPeriod = payoutPeriod;
      this.payout = payout;
      this.wastePeriod = wastePeriod;
      this.cost = cost;
      this.growID = growID;
      this.harvID = harvID;
      
      this.HasNoCrop = function(row, column){
          var check = (theMap.placeableLayer[column][row] != this.growID 
                          && theMap.placeableLayer[column][row] != this.harvID);
          
          return check;
      }
  }
  
  //*******************************CROP OBJECTS**********************************/
  var Wheat = new Crop(15000, 20000, 100, 50, atlasTiles.wheat, atlasTiles.wheatH);
  var Corn = new Crop(20000, 20000, 100, 200, atlasTiles.corn, atlasTiles.cornH);
  var Cherry = new Crop(30000, 10000, 200, 500, atlasTiles.cherry, atlasTiles.cherryH);
  var EnWheat = new Crop(15000, 20000, 100, 50, atlasTiles.enWheat, atlasTiles.enWheatH);
  var EnCorn = new Crop(20000, 20000, 100, 200, atlasTiles.enCorn, atlasTiles.enCornH);
  var EnCherry = new Crop(30000, 10000, 200, 500, atlasTiles.enCherry, atlasTiles.enCherryH);
  
  /**********************************THE CROPS SIMPLETON*********************************/
  //the crops and their functions
  var theCrops = {
      
      //when harvesting up a crop, this happens
      cropYield: function(crop, player, ladybug){
          player.crops--;
          
          if(ladybug === false){
              player.money += crop.payout;
          }
          else
          {
              player.money += crop.payout * 1.5;
          }
          
          //console.log("Current Money: " + player.money);
          
      },
      
      //when planting a crop, this happens
      cropPlant: function(crop, player){
          player.crops++;
          player.money -= crop.cost;
      },
      
      //checks if everything is good to plant a crop
      //!!!!!!!!!!THIS IS FOR PLAYER ----FIGURE OUT PROTOTYPES (inheritience)
      //!!!!!!!!!!!MERGE THIS AND canAiGrowCrops
      canGrowCrops: function(row, column, player){
          var check = false;
          
          //check if you can place a crop
          check = (theMap.secondLayer[column][row] == atlasTiles.empty);
          
          //checks if there is a crop already there. 
          if(check){
              check = player.IsNoCropAt(row, column);
          }
          
          //check if there is a base or crop tile nearby
          if(check){
              check = false;
              
              var j = column;
              
              
              if(j >= 2){
                  j -= 2;
              }
              
              var jstart = j;
              
              var je = column;
              
              if(je < gridHeight - 2){
                  je += 2;
              }
              
              var i = row;
              
              if(i >= 2) {
                  i -= 2;
              }
              
              var istart = i;
              
              
              var ie = row;
              if(ie < gridWidth - 2){
                  ie += 2;
              }
              
              
              for(j = jstart; j <= je; j++){
                  for(i = istart; i <= ie; i++){
                      
                     if(PlayerDriver.isPBase(i, j, player)){
                          check = true;
                      }                
                  }
                 
              }
          }
          
          return check;
      },
      
      //will check to make sure that there was no growing crops
      //and that a tile is empty
      //WHEN WE GET MORE CROPS, cropTypes will become an array
      //and the user will have to cycle through
      NoCropCheck: function(row, column){
          var check = false;
          
          if(theMap.placeableLayer[column][row] == atlasTiles.aiHarv
              || theMap.placeableLayer[column][row] == atlasTiles.harvest){
              check = true;   
          }
         
          
          return check;
      },
      
      wasteCrop: function(row, column, id){
          
          if(theMap.idLayer[column][row].tileID == id){
              
              theMap.placeableLayer[column][row] = atlasTiles.wasted;
              theMap.idLayer[column][row].tileType = atlasTiles.empty;
          }   
      }
  };
  
/***************************MAIN DRIVER***************************/
// is called after atlas is loaded successfully
function main(){

    render();
    
    
    
    //find the location of the protest button
    protestBut.findLoc();
    
    //find the location of the build base button
    baseBut.findLoc();
    
    //find the location of the worker button
    workerBut.findLoc();
    
    //find the location of the player's base
    thePlayer.findBase();
    theAI.findBase();
    
    //redraws the map and updates
    setInterval(Game.iterate, 100);
    
    //runs the AI
    setInterval(Game.run, theAI.speed);
}