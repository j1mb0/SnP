/**********************************************canvas************************************************/

//get canvas object
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//set dimensions of canvas
canvas.width = 1000;
canvas.height = 800;

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
atlas.src="img/finaltextures.png";

//this is a struct of ints, relating to tile ids.
//this is a fix (maybe not a good one) for how
//everything would break when the atlas changes.
var atlasTiles = {
    empty : -1, 
    pBase1 : 15, pBase2: 16, pBase3: 35, pBase4: 36,
    hightlight : 6, seeds: 55, seedBut: 56, 
    enBase1: 13, enBase2: 14,
    enBase3: 33, enBase4: 34, crop : 146, 
    harvest: 149, protest: 18, 
    aiCrop: 147, aiHarv: 148
    
};


/*********************************************Events************************************************/

//!!!!!Figure out how to get a function (object) call into the second parameter of addEventLister

//get clicks
//!!!!!Works with scrolling, but window.scroll is not a recommended function
//for maximum compatibility. 
canvas.addEventListener('click', function(e){
        
        //console.log("(", window.scrollX, ", ", window.scrollY, ")");
        
        
       var posx = event.clientX - canvas.offsetLeft + window.scrollX; 
       var posy = event.clientY - canvas.offsetTop + window.scrollY;
       tileClick(posx, posy);
       //console.log("(", e.pagex, ", ", e.posx, ")"); 
       
    }, false);
    

/*    
//These don't work, probably because I don't understand
//what mousemove and mouseout actually does.
canvas.addEventListener('mousemove', function(e){
       var posx = event.clientX - canvas.offsetLeft;
       var posy = event.clientY - canvas.offsetTop;
       tileOver(posx, posy);
       //console.log("(", posx, ", ", posy, ")"); 
    }, false);
 */ 
/*
canvas.addEventListener('mouseout', function(e){
       var posx = event.clientX - canvas.offsetLeft;
       var posy = event.clientY - canvas.offsetTop;
       tileOut(posx, posy);
       //console.log("(", posx, ", ", posy, ")"); 
    }, false);
*/

//Keyboard controls
//current doesn't do anything - could use later tho
var keysDown = {};
addEventListener("keydown", function(e){
    keysDown[e.keyCode]=true;
    
    //prints out to console just to test
    //console.log(e.keyCode);
}, false);


/*************************************EVENT DRIVEN FUNCTIONS***************************************/

//gets a row index (i) from a x position
function getRowCol(x, y){
    
    //get row
    var row = x / tileWidth;
    var column = y / tileHeight;
    
    //round it down
    row = Math.floor(row);
    column = Math.floor(column);
    
    return {"row": row, "column": column};
}




//is called by click event
//this will calculate the row and column of the click,
//and update the drawing map (placeableLayer) accordingly
//!!!!! When we update our tile sets THIS WILL BREAK!
//!!!! Have to figure out how to differentiate where it is okay
//!!!! to draw and not to draw. Maybe another 2d array?
function tileClick(x, y){
    //get the row and column
    var position = getRowCol(x, y);
    
    
    
    //update the layer and trigger events.
    if(theCrops.canGrowCrops(position.row, position.column)){
        theMap.placeableLayer[position.column][position.row] = atlasTiles.crop;
        theCrops.cropPlant();
        setTimeout(function() {
            theMap.placeableLayer[position.column][position.row] = atlasTiles.harvest;
            
            }, theCrops.payoutPeriod);
        
    } else if(theMap.placeableLayer[position.column][position.row] == atlasTiles.harvest){
        theCrops.cropYield(thePlayer.isAI);
        theMap.placeableLayer[position.column][position.row] = atlasTiles.empty;
    }
}

/*
//NOT WORKING - Something to do with how canvas draws
// first. 
function tileOver(x, y){
    //get the row and column
    var position = getRowCol(x,y);
   
    theMap.highlightLayer[position.column][position.row] = atlasTiles.highlight;
    
}
*/

/*
//NOT WORKING - same as above
function tileOut(x, y){
    //get the row and column
    var position = getRowCol(x, y);
    
   
    theMap.highlightLayer[position.column][position.row] = -1;
    
}
*/


//I hate anonymous functions, and I really want to implement this to increase readability. Javascript doesn't like this.
//FIX IN FUTURE
/*
function onMouseClicked(event){
       var posx = event.clientX;
       var posy = event.clientY;
       console.log("(", posx, ", ", posy, ")");
}
*/

/**************************************FUNCTIONS********************************************/
///!!!!!!!!THESE NEED AN OBJECT TO GO INTO


//initializes a 2d array to -1, basically undrawable tiles
function init2dArray(the2dArray){
    
    //columns
    for(var j = 0; j <= theMap.gridHeight - 1; j++){
        
        //rows
        for(var i = 0; i <= theMap.gridWidth - 1; i++){
            the2dArray[j][i] = atlasTiles.empty;
            //console.log(mapData[i][j]);
        }
    }
}


//redraws the placeableLayer, or the map layer with placeable tiles.
function iterate(){
    //drawMap(theMap.baseLayer);
    //drawMap(theMap.placeableLayer);
    //drawMap(theMap.highlightLayer);
    //init2dArray(theMap.highlightLayer);
    if(succesfullyDraw){
        
        redrawMap();
        
        ctx.fillText("$" + thePlayer.money, theMenu.moneyPos.x, theMenu.moneyPos.y);
        ctx.fillText("$" + theAI.money, theMenu.moneyPos.x, ((theMenu.moneyPos.y) + 20));
    }
}

function redrawMap(){
    theMap.drawMap(theMap.baseLayer);
    theMap.drawMap(theMap.firstLayer);
    theMap.drawMap(theMap.secondLayer);
    theMap.drawMap(theMap.placeableLayer);
    theMap.drawMap(theMap.menuLayer);
    //drawMap(theMap.highlightLayer);
    
}

//this function will render the map.
function render(){
    
        //prepare + draw base layer
        theRasters.parseRaster(theRasters.baseRaster, theMap.baseLayer);
        
        //prepare + draw first layer    
        theRasters.parseRaster(theRasters.firstRaster, theMap.firstLayer);
        
        //prepare + draw second layer    
        theRasters.parseRaster(theRasters.secondRaster, theMap.secondLayer);
        
        //initialize placeable layer
        //init2dArray(placeableLayer);
        theRasters.parseRaster(theRasters.placeablesRaster, theMap.placeableLayer);
       
        //draw the menu
        theRasters.parseRaster(theRasters.menuRaster, theMap.menuLayer);
        
        redrawMap();
        
        init2dArray(theMap.highlightLayer);
        
        succesfullyDraw = true;
}

 // is called after atlas is loaded successfully
function main(){
        //var now = Date.now();
        //var delta = now - then;
        //update(delta/1000);
        render();
        //then = now;
        
        theAI.findLoc();
        setInterval(iterate, 100);
        setInterval(theAI.execute, theAI.speed);
        
 
}
/*************************************************OBJECTS****************************************************/
//!!! DO THESE REALLY NEED TO GO ON THE BOTTOM????

//this is a function, but it's only purpose is to made 
//2d arrays, so it's here. 
function make2d(){
        var layer = new Array(gridHeight);
        for (var j = 0; j < gridHeight; j++) {
            layer[j] = new Array(gridWidth);
            //for(var i = 0; i < gridWidth; i++){
            //    layer[j][i] = new aTile();
            //}
        }
        
        return layer;
    
}

//it's you
var thePlayer = {
    activeCrops: 0,
    money: 1000,
    isAI: false,
    
    isPBase: function(row, column){
        var check = false;
        
        if(theMap.firstLayer[column][row] == atlasTiles.pBase1){
            check = true;
        }
        
        if(theMap.firstLayer[column][row] == atlasTiles.pBase2){
            check = true;
        }
        
        if(theMap.firstLayer[column][row] == atlasTiles.pBase3){
            check = true;
        }
        
        if(theMap.firstLayer[column][row] == atlasTiles.pBase4){
            check = true;
        }
        
        return check;
        
    }
};

//It's in your base, killing all your dudes
//this class SHOULD inherit from thePlayer
var theAI = {
    activeCrops: 0,
    money: 1000,
    loci: 0,
    locj: 0,
    isAI: true,
    speed: 2000,
    
    
    //checks for an AI base tile
    //
    isAiBase: function(row, column){
        var check = false;
        
        if(theMap.firstLayer[column][row] == atlasTiles.enBase1){
            check = true;
        }
        
        if(theMap.firstLayer[column][row] == atlasTiles.enBase2){
            check = true;
        }
        
        if(theMap.firstLayer[column][row] == atlasTiles.enBase3){
            check = true;
        }
        
        if(theMap.firstLayer[column][row] == atlasTiles.enBase4){
            check = true;
        }
        
        return check;
        
    },
    
    findLoc: function(){
        var loc = theMap.searchLayer(theMap.firstLayer, atlasTiles.enBase1);
        this.loci = loc.row;
        this.locj = loc.col;
    },
    
    //that evil AI just loves harvesting,
    //cause it makes him money
    harvest: function(row, column){
        theAI.activeCrops--;
        theAI.money += theCrops.payout;
        theMap.placeableLayer[column][row] = atlasTiles.empty;
        //console.log("attempting to harvest: " + row + " " + column);;
    },
    
    //the AI doesn't like this as much as harvesting
    //but is dedicated none-the-less
    plant: function(row, column){
        theAI.activeCrops++;
        theAI.money -= theCrops.cost;
        theMap.placeableLayer[column][row] = atlasTiles.aiCrop;
        setTimeout(function() {
        
        theMap.placeableLayer[column][row] = atlasTiles.aiHarv;
        
        }, theCrops.payoutPeriod);
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
        if(seed === 1 && theTile.row < theMap.gridWidth) {
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
        if(seed === 1 && theTile.column < theMap.gridHeight) {
            theTile.column++;
        }
    },
    
    //searches for a tile that is either
    //plantable or harvestable
    //pretty nice little bit of recursion, if I don't say so myself *smug face*
    //!!!! Since returning didn't do what it was supposed to
    //!!!! I just added a bool to the aTile function, and passed in
    //!!!! an object of aTile in by reference.
    //!!!! The return functions are now only for breaking the recursion -MAKE IT BETTER
    search: function(theTile){
            
        if(theCrops.canAiGrowCrops(theTile.row, theTile.column))
        {
            //return false if the AI can plant
            //!!! figure something else out!
            return false;
        } 
        else if(theMap.placeableLayer[theTile.column][theTile.row] == atlasTiles.aiHarv)
        {
            //return true if it can harvest
            theTile.canHarvest = true;
            return true;
        }
        else 
        {
            //the recursive bit. 
            //First randomly move the tile
            theAI.moveTile(theTile);
            
            //then repeat this step
            theAI.search(theTile); 
        }
        
    },
    
    //the AI, just like Rick Ross, likes to hustle.
    //this is what it does, as fast as it can.
    execute: function(){
        //makes a tile to hold the move's action
        var theTile = new aTile();
        theTile.row = theAI.loci;
        theTile.column = theAI.locj;
       
        //searches for a place to plant or harvest
        var canHarvest = theAI.search(theTile);
        
        //if it can harvest, it'll do that
        //if it can't, it'll plant if it has
        //the money
        if(theTile.canHarvest){
            theAI.harvest(theTile.row, theTile.column);
            
        } else if(theAI.money > theCrops.cost){
            
            theAI.plant(theTile.row, theTile.column);
            //console.log("attempting to plant: " + theTile.row + " " + theTile.column);
        }
    } 
};

//Hold's functions and details for the menu
var theMenu = {
    moneyPos: {x: 20, y: 20}
    
};

//the crops and their functions
var theCrops = {
    payoutPeriod: 10000,
    payout: 100,
    cost: 50,
    
    //when harvesting up a crop, this happens
    cropYield: function(){
        thePlayer.crops--;
        thePlayer.money += 100;
        //console.log("Current Money: " + thePlayer.money);
        
    },
    
    //when planting a crop, this happens
    cropPlant: function(){
        thePlayer.crops++;
        thePlayer.money -= 50;
    },
    
    //checks if everything is good to plant a crop
    //!!!!!!!!!!THIS IS FOR PLAYER ----FIGURE OUT PROTOTYPES (inheritience)
    //!!!!!!!!!!!MERGE THIS AND canAiGrowCrops
    canGrowCrops: function(row, column){
        var check = false;
        
        //check if you can place a crop
        check = (theMap.firstLayer[column][row] == atlasTiles.empty);
        
        //checks if there is a crop already there. 
        if(check){
            check = (theMap.placeableLayer[column][row] != atlasTiles.crop);
        }
        
        if(check){
            check = (theMap.placeableLayer[column][row] != atlasTiles.harvest);
        }
        
        
        
       /* //check if you can afford to place a crop
        // !!!! DON'T WE WANT AI TO DO THIS TOO? This function is not just something for players
        if(check) {
            check = (thePlayer.money >= theCrops.cost);
        }
        */
        
        //check if there is a base or crop tile nearby
        if(check){
            check = false;
            for(var j = column - 1; j <= column + 1; j++){
                for(var i = row - 1; i <= row + 1; i++){
                    
                    if(thePlayer.isPBase(i, j) || theMap.placeableLayer[j][i] == atlasTiles.crop){
                        check = true;
                    }                
                }
            }
        }
        
        return check;
    },
        
    //checks if everything is good to plant a crop for the AI
    //IF I knew how to use javascript's inheritence, I could 
    //make canGrowCrops and canAiGrowCrops into one function
    //supporting multiplayer in the future.
    canAiGrowCrops: function(row, column){
        var check = false;
        
        //check if you can place a crop
        check = (theMap.firstLayer[column][row] == atlasTiles.empty);
        
        //checks if there is a crop already there. 
        if(check){
            check = (theMap.placeableLayer[column][row] != atlasTiles.aiCrop);
        }
        
        //checks that it isn't a harvestable crop
        if(check){
            check = (theMap.placeableLayer[column][row] != atlasTiles.aiHarv);
        }
        
        
        //check if you can afford to place a crop
        // !!!! DON'T WE WANT AI TO DO THIS TOO? This function is not just something for players
        if(check) {
            check = (theAI.money >= theCrops.cost);
        }
        
        //check if there is a base or crop tile nearby
        if(check){
            check = false;
            for(var j = (column - 1); j <= (column + 1); j++){
                for(var i = (row - 1); i <= (row + 1); i++){
                    
                    if(i > -1 && j > -1 && i < theMap.gridWidth && j < theMap.gridHeight){
                        if(theAI.isAiBase(i, j) || theMap.placeableLayer[j][i] == atlasTiles.aiCrop){
                            check = true;
                        }
                    }
                }
            }
        }
        
        return check;
        } 
    
};

//!!!!! IDEA: Make the map array filled with tile obj
//with layer members and properties. This could greatly
//simplify things
//!!!!!!!!NOT IMPLEMENTED YET!!!!!!!!!!!
function aTile(){
    this.row = -1;
    this.column = -1;
    this.canHarvest = false;
    
    
    this.baseLayerId -1;
    this.firstLayerId -1;
    this.placeableLayerId -1;
    this.highlightLayerID -1;
    this.menuLayerid -1;
    //and so on.
}
    
//not having these here breaks a lot of stuff.
var tileWidth = 50;
var tileHeight = 50;
var gridWidth = 20;
var gridHeight = 16;

//this object holds all of the 
var theMap = {
    tileWidth: 50,
    tileHeight: 50,
    gridWidth: 20,
    gridHeight: 16,

    //for the grass and stuff
    baseLayer : make2d(),
    
    //hills and water n stuff
    //these won't be modified ever
    //it does contain the base, and
    //is used to check base location
    firstLayer : make2d(),
    
    //adding another layer of
    // terrain
    secondLayer : make2d(),
    
    //placeables
    placeableLayer : make2d(),
    
    //menu
    menuLayer : make2d(),
    
     //for highlight effect on mouseover
    highlightLayer : make2d(),
    
    //draws the map. Takes in an 2d array of integer values and prints out the corresponding tile
    drawMap: function(the2dArray){
    
        //outside is the columns
        for(var j = 0; j <= theMap.gridHeight - 1; j++){
        
            // inside is the rows
            for(var i = 0; i <= theMap.gridWidth - 1; i++){
                
                //every value above -1 is a tile to be drawn
                if(the2dArray[j][i] > atlasTiles.empty){
                    var x = (the2dArray[j][i] % theMap.gridWidth) * theMap.tileWidth;
                    var y = the2dArray[j][i]; 
                    y = (Math.floor(y / theMap.gridWidth)); 
                    y *= theMap.tileHeight;
                    
                    //an overload of draw image
                    ctx.drawImage(atlas, x, y, theMap.tileWidth, theMap.tileHeight, 
                                    i * theMap.tileWidth, j * theMap.tileHeight, theMap.tileWidth, theMap.tileHeight);
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
    }

};


/*********************************************UGLY RASTERS***************************************/

var theRasters = {
    //for the grass and stuff
    baseRaster: [19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 58, 60, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 58, 59, 79, 80, 19, 19, 19, 58, 60, 19, 19, 19, 19, 19, 58, 59, 60, 19, 19, 58, 79, 79, 79, 80, 19, 19, 19, 78, 79, 60, 19, 19, 19, 19, 98, 99, 100, 19, 19, 98, 79, 79, 79, 100, 19, 19, 19, 98, 99, 100, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 98, 99, 100, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 58, 59, 60, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 58, 79, 79, 79, 60, 19, 19, 19, 58, 60, 19, 19, 19, 19, 19, 19, 19, 19, 19, 58, 79, 79, 79, 79, 80, 19, 19, 19, 98, 100, 19, 19, 19, 19, 19, 19, 19, 19, 19, 78, 79, 79, 79, 79, 100, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 78, 79, 99, 99, 100, 19, 19, 19, 58, 60, 19, 19, 19, 19, 19, 19, 58, 59, 60, 19, 98, 100, 19, 19, 19, 19, 19, 19, 78, 80, 19, 19, 19, 19, 58, 59, 79, 79, 80, 19, 19, 19, 19, 19, 19, 19, 19, 19, 98, 100, 19, 19, 19, 19, 98, 79, 79, 79, 79, 60, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 78, 79, 79, 79, 80, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 98, 99, 99, 99, 100, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
    
    //hills and water n base
    firstRaster: [53, 54, 55, 44, 45, 0, 0, 0, 0, 184, 165, 165, 186, 0, 0, 0, 0, 0, 0, 0, 73, 74, 75, 64, 65, 0, 0, 0, 0, 0, 164, 166, 0, 0, 0, 0, 0, 0, 0, 0, 73, 74, 75, 84, 85, 0, 0, 0, 0, 144, 165, 186, 0, 0, 0, 0, 0, 0, 0, 0, 73, 74, 75, 104, 105, 0, 0, 0, 0, 164, 166, 0, 0, 0, 0, 0, 14, 15, 0, 0, 93, 94, 95, 124, 125, 0, 0, 0, 0, 164, 166, 0, 0, 0, 0, 0, 34, 35, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 164, 165, 146, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 164, 165, 166, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 165, 165, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 165, 165, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 164, 165, 186, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 164, 166, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 17, 0, 0, 0, 184, 165, 146, 0, 0, 0, 0, 0, 41, 42, 43, 44, 45, 0, 0, 36, 37, 0, 0, 0, 0, 184, 165, 146, 0, 0, 0, 0, 61, 62, 63, 64, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 184, 165, 146, 0, 0, 0, 81, 82, 83, 84, 85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 164, 166, 0, 0, 0, 101, 102, 103, 104, 105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 144, 165, 165, 146, 0, 0, 121, 122, 123, 124, 125],
    
    //another layer of terrain
    secondRaster: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 141, 142, 0, 46, 49, 0, 0, 0, 0, 50, 51, 51, 52, 0, 0, 0, 0, 0, 0, 0, 161, 162, 0, 86, 89, 0, 0, 0, 0, 70, 71, 71, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 91, 71, 72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 92, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 46, 47, 47, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 67, 67, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 67, 67, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 51, 51, 0, 0, 86, 89, 0, 0, 0, 0, 0, 0, 0, 46, 47, 48, 47, 49, 0, 90, 91, 91, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 66, 67, 68, 68, 69, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 87, 88, 88, 89, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 71, 72, 0, 0, 0, 0, 0, 0, 0, 0, 141, 142, 0, 0, 0, 0, 0, 0, 0, 70, 71, 72, 0, 0, 0, 0, 0, 0, 0, 0, 161, 162, 0, 0, 0, 0, 0, 0, 0, 90, 91, 92, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    
    //placeables
    placeablesRaster: [0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 143, 0, 143, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 143, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 143, 0, 143, 0, 0, 0, 0, 143, 0, 0, 143, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 143, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 143, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 143, 0, 143, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 0, 0, 0, 0, 0, 143, 143, 0, 0, 143, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 143, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 143, 0, 0, 143, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0, 0, 0, 0, 143, 0, 0, 0, 0, 0],
    
    //menu
    menuRaster: [53, 54, 55, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 74, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 57, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 73, 18, 75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

    //Since the JSON gives us a raster array of int values, we need to convert it into
    // a corresponding 2d array. 
    parseRaster: function(theRaster, the2dArray){
        //for going through the raster
        var k = 0;
        
        //controls columns
        for(var j = 0; j <= theMap.gridHeight - 1; j++){
            
            //controls rows
            for(var i = 0; i <= theMap.gridWidth - 1 ; i++){
                
                //copies it over
                the2dArray[j][i] = theRaster[k] - 1;
                k++;
            }
        }    
    }
}



//triggers redraw reallly quickly
//if(succesfullyDraw){
//setInterval(iterate, 100);



