/*  Copyright 2017 James "J1mb0" Schiffer
    
    written by : J1mb0
    written for : CS494 Final Project
*/

/****************************PLAYER CLASS*************************/
var aPlayer = function(game_instance, player_insance, crop1, crop2, crop3, isEnemy){
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

aPlayer.prototype.initialize = function(crop1, crop2, crop3){
    this.won = false;
    
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
}

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

 
//that AI just loves harvesting,
//cause it makes him money
aPlayer.prototype.harvest = function(theTile){    
    if(theTile.tileType === this.crop1.harvID)
    {
        this.money += this.crop1.payout;
    }
    else if(theTile.tileType === this.crop2.harvID)
    {
        this.money += this.crop2.payout;
    }
    else if(theTile.tileType === this.crop3.harvID)
    {
        this.money += this.crop3.payout;
    }
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
