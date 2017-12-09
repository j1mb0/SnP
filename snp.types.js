//this is a struct of ints, relating to tile ids.
//this is a fix (maybe not a good one) for how
//everything would break when the atlas changes.
var atlasTiles = {
    empty : -1, 
    pBase1 : 24, pBase2: 25, pBase3: 44, pBase4: 45,
    hightlight: 6, seeds: 129, seedBut: 130, 
    enBase1: 21, enBase2: 22,
    enBase3: 41, enBase4: 42, wheat: 180, 
    wheatH: 183, protest: 27, 
    enWheat: 181, enWheatH: 182, tree: 136,
    wasted: 136, baseBut: 26, workerBut: 128,
    cherry: 13, cherryH: 16, enCherry: 14,
    enCherryH: 15, corn: 17, cornH: 20,
    enCorn: 18, enCornH: 19, ladybug: 123,
    lawsuit: 124
};


//******************************TILE CLASS**************************************/
function aTile(){
    this.row = -1;
    this.column = -1;
    this.canHarvest = false;
    this.tileType = -1;
    this.tileID = -1; 
}

/*********************************CROPS CLASS********************************/
function Crop(payoutPeriod, wastePeriod, payout, cost, growID, harvID){
    this.payoutPeriod = payoutPeriod;
    this.payout = payout;
    this.wastePeriod = wastePeriod;
    this.cost = cost;
    this.growID = growID;
    this.harvID = harvID;
}
//server side we set the 'aPlayer' class to a global type, so that it can use it anywhere.
if( 'undefined' != typeof global ) {
    module.exports = global = {
    Crop,
    aTile,
    atlasTiles }
}