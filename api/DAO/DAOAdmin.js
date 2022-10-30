
const res = require('express/lib/response');
class DAOAdmin {
    pos1 = [];
    pos2 = [];
    ttl = 60;
    tresorType;
    start = false;
    constructor() {}

    /*
        Change position rectangle
    */
    changePosition(pos1x,pos1y, pos2x, pos2y){
        this.pos1 = [pos1x,pos1y]
        this.pos2 = [pos2x,pos2y];
    }
}

module.exports.DAOAdmin = DAOAdmin;