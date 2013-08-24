
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
