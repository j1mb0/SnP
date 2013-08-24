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