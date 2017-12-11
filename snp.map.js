/*  Copyright 2017 James "J1mb0" Schiffer
    
    written by : J1mb0
    written for : CS494 Final Project
*/

var aLayer = function(theRaster, width, height)
{
    this.width = width;
    this.height = height;

    // make a 2d array
    this.data = new Array(this.height);
    for (var j = 0; j < this.height; j++) {
        this.data[j] = new Array(this.width);
    }

    //for going through the raster
    var k = 0;
    
    //controls columns
    for(var j = 0; j <= this.height - 1; j++){
        //controls rows
        for(var i = 0; i <= this.width - 1 ; i++){
            this.data[j][i] = theRaster[k] - 1;
            k++;
        }
    }    
};  // aLayer Constructor


//Searches for an tile ID
aLayer.prototype.search = function(tileID){
    var loci = -1;
    var locj = -1;
    
    for(var j = 0; j <= this.height - 1; j++){
        for(var i = 0; i <= this.width - 1; i++){
            if(this.data[j][i] === tileID){
                loci = i;
                locj = j;
            }
        }
    }
    
    return {row: locj, col: loci};
};

//Sets all data in a layer to empty
aLayer.prototype.initialize = function(){
    //columns
    for(var j = 0; j <= this.height - 1; j++){
        //rows
        for(var i = 0; i <= this.width - 1; i++){
            this.data[j][i] = atlasTiles.empty;
        }
    }
};

//this object holds all of the map related data, included all the of the layers 
var game_map = function(gridHeight, 
                        gridWidth, 
                        tilePixelSize, 
                        baseRaster,
                        firstRaster,
                        secondRaster,
                        placeableRaster,
                        buttonRaster,
                        frameRaster,
                        highlightRaster)
{
    this.gridHeight = gridHeight;
    this.gridWidth = gridWidth;
    this.tilePixelSize = tilePixelSize;

    // if we are working on a server we need to import
    if( 'undefined' != typeof global ){
        require("./snp.types.js");
        aTile = global.aTile;
        atlasTiles = global.atlasTiles;
    }
    //for the grass and stuff
     this.baseLayer = new aLayer(baseRaster, this.gridWidth, this.gridHeight);
     
     //hills and water n stuff
     //these won't be modified ever
     this.firstLayer = new aLayer(firstRaster, this.gridWidth, this.gridHeight);
     
     //adding another layer of
     // terrain - not plantable but for bases and obstrutive buildings
     //is used to check base location
     this.secondLayer = new aLayer(secondRaster, this.gridWidth, this.gridHeight);
     
     //placeables - crops
     this.placeableLayer = new aLayer(placeableRaster, this.gridWidth, this.gridHeight);
     
     //menu 
     this.buttonLayer = new aLayer(buttonRaster, this.gridWidth, this.gridHeight);
     
     //frames for buttons;
     this.frameLayer = new aLayer(frameRaster, this.gridWidth, this.gridHeight);
     
      //for highlight effect on mouseover
     this.highlightLayer = new aLayer(highlightRaster, this.gridWidth, this.gridHeight);
     
     this.idLayer = this.make2dTiles();
};  // a map constructor

game_map.prototype.make2dTiles = function(){
    var layer = new Array(this.gridHeight);
    for (var j = 0; j < this.gridHeight; j++) {
        layer[j] = new Array(this.gridWidth);
        for(var i = 0; i < this.gridWidth; i++){
            layer[j][i] = new aTile();
            layer[j][i].tileID = -1;
            layer[j][i].row = i;
            layer[j][i].column = j;
        }
    }
    return layer;
};

game_map.prototype.generateID = function(theTile){
    theTile.tileID = Math.floor(Math.random()*10001);     
};

game_map.prototype.clearID = function(row, column){
    this.idLayer[row][column].tileID = atlasTiles.empty; 
    this.idLayer[row][column].tileType = atlasTiles.empty;
};

game_map.prototype.isPBase = function(row, column, baseId1, baseId2, baseId3, baseId4){
    var check = false;
    var id = this.secondLayer.data[row][column];

    if(id === baseId1)
    {
        check = true;
    }
    
    if(id === baseId2)
    {
        check = true;
    }
    
    if(id === baseId3)
    {
        check = true;
    }
    
    if(id === baseId4)
    {
        check = true;
    }

    return check;  
};

//checks if everything is good to plant a crop
//!!!!!!!!!!THIS IS FOR PLAYER ----FIGURE OUT PROTOTYPES (inheritience)
//!!!!!!!!!!!MERGE THIS AND canAiGrowCrops
game_map.prototype.canGrowCrops = function(row, column, baseId1, baseId2, baseId3, baseId4){
    var check = false;
    
    //check if you can place a crop on terrain
    check = (this.secondLayer.data[row][column] === atlasTiles.empty);
    
    //checks that there is not a crop already there. 
    if (check)
    {
        check = (this.placeableLayer.data[row][column] === atlasTiles.empty
                || this.placeableLayer.data[row][column] === atlasTiles.tree);
    }
    //check if there is a base or crop tile nearby
    if(check){
        check = false;
        
        // get the kernel in which a base must be in
        var jstart = column >= 2 ? column - 2 : column;                      // left-most column
        var je = column < (this.gridWidth - 2) ? column + 2 : column;  // right-most column
        
        var istart = row >= 2 && row <= this.gridWidth ? row - 2 : row;                               // highest row
        var ie = row < (this.gridHeight - 2) ? row + 2 : row;            // lowest row

        // look for the base
        for(var i = istart; i <= ie; i++)   // row
        {
            for(var j = jstart; j <= je; j++)  // column 
            {                    
                if(this.isPBase(i, j, baseId1, baseId2, baseId3, baseId4))
                {
                    check = true;
                    break;
                }                
            }
        }
    }
    
    return check;
};

game_map.prototype.place = function(row, column, crop){
    // we need to save some variables on the stack so the timeout functions
    // can access them
    placeLayer = this.placeableLayer;
    tileLayer = this.idLayer;

    placeLayer.data[row][column] = crop.growID;
    this.generateID(tileLayer[row][column], crop);
    var id = tileLayer[row][column].tileID;
    tileLayer[row][column].tileType = crop.growID;
    setTimeout(function() {
        placeLayer.data[row][column] = crop.harvID;
        tileLayer[row][column].tileType = crop.harvID;
        
        setTimeout(function() {
            if(tileLayer[row][column].tileID === id){
                
                placeLayer.data[row][column] = atlasTiles.wasted;
                tileLayer[row][column].tileType = atlasTiles.empty;
            }
        }, crop.wastePeriod);
    }, crop.payoutPeriod);
};

game_map.prototype.remove = function(row, column){
    this.clearID(row, column);
    this.placeableLayer.data[row][column] = atlasTiles.empty;
};

game_map.prototype.reInitLayer = function(layer, raster){
    layer = new aLayer(raster, this.width, this.height);
};

//server side we set the 'game_map' class to a global type, so that it can use it anywhere.
if( 'undefined' != typeof global ) {
    module.exports = global.game_map = game_map;
}