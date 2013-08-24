function Button(id){
    this.locx = -1;
    this.locy = -1;
    this.id = id;
    
    
}

//Button.prototype.

var Protest = function(){
    loci: -1,
    locj: -1,
    
    findProtest: function(){
        var loc = theMap.searchLayer();
        this.loci = loc.row;
        this.locj = loc.col;
    }
    
};