


/****************************PLAYER CLASS*************************/
var aPlayer = function(game_instance, player_insance, isEnemy, crop1, crop2, crop3){
    this.instance = player_insance;
    this.game = game_instance;
    this.state = "not connected";
    this.state_time = new Date().getTime();
    this.id = "";
    this.host = false;
    this.inputs = [];
    this.won = false;
    this.ready = false;
    
    this.toWin = 5000;
    this.activeCrops = 0;
    this.money = 300;
    
    this.baseID1 = atlasTiles.pBase1;
    this.baseID2 = atlasTiles.pBase2;
    this.baseID3 = atlasTiles.pBase3;
    this.baseID4 = atlasTiles.pBase4;
    
    this.baseRow = -1;
    this.baseColumn = -1;
    this.crop1 = crop1;
    this.crop2 = crop2;
    this.crop3 = crop3;

    this.curCrop = crop1;
    
    this.protest = false;
    this.ladybug = false;
    
    this.speed = 200;    
    
    this.canWork = false;
};

//when harvesting up a crop, this happens
aPlayer.prototype.cashOut = function(crop){
    this.crops--;
    
    //if(ladybug === false){
    this.money += crop.payout;
    // }
    // else
    // {
    //     player.money += crop.payout * 1.5;
    // }
    
    //console.log("Current Money: " + player.money);   
};

aPlayer.prototype.getCrop = function(theTile){    
    if(theTile.tileType === this.crop1.harvID)
    {
        theCrops.cropYield(crop1, this, false);
    }
    else if(theTile.tileType === this.crop2.harvID)
    {
        theCrops.cropYield(crop2, this, false);
    }
    else if(theTile.tileType === this.crop3.harvID)
    {
        theCrops.cropYield(crop3, this, false);
    }
};
 
//that AI just loves harvesting,
//cause it makes him money
aPlayer.prototype.harvest = function(theTile, player){    
    player.getCrop(theTile);
    theMap.placeableLayer[theTile.column][theTile.row] = atlasTiles.empty;
    mapDoes.clearID(theMap.idLayer[theTile.column][theTile.row]);
};

//plant a crop
aPlayer.prototype.plant = function(){

    this.activeCrops++;
    this.crops++;
    this.money -= this.curCrop.cost; 
    
        // ********** AUDIO **********
    //if(this.isEnemy === false){
    //    document.getElementById('click').play();
    //}    
        // ********** AUDIO **********
};

aPlayer.prototype.canHarvest = function(tileType){
    var check = false;
    
    if(tileType === this.crop1.harvID 
       || tileType === this.crop2.harvID
       || tileType === this.crop3.harvID) 
    {
        check = true;   
    }
    
    return check;
};

//server side we set the 'aPlayer' class to a global type, so that it can use it anywhere.
if( 'undefined' != typeof global ) {
    module.exports = global.aPlayer = aPlayer;
}
