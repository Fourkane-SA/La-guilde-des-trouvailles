class GeoResource {

    id; // String
    url; //String
    position; // LatLng
    role; //String

    constructor(id, url, position, role,ttl, treasures) {
      this.id = id;
      this.url = url;
      this.position = position;
      this.role = role;
      this.ttl = ttl;
      this.treasures = treasures;
    }

    get id() { return this.id;}
    get url() { return this.url;}
    get position() { return this.position;}
}
module.exports.GeoResource = GeoResource;