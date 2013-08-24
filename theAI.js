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