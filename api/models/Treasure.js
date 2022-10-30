class Treasure {

    id; //String
    position; // array Leaflet
    composition; //String

    constructor(id, position,composition) {
      this.id = id;
      this.position = position;
      this.composition = composition;
    }
  }

  module.exports.Treasure = Treasure;