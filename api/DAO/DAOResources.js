var {GeoResource} = require('../models/GeoResource')
var {Treasure} = require('../models/Treasure');
const res = require('express/lib/response');
class DAOResources {
    ttlMax = 0
    resources = [] // Contain all the resources of the game
    
    // Initialize the array of resources
    constructor() {
        var resourceFrancais = new GeoResource("francais","https://pbs.twimg.com/profile_images/1298643948/FranceFlag_svg_400x400.png",[45.78205527590259,4.86594021320343],"player",5,[])
        resourceFrancais.start = false;
        var resourceEnglish = new GeoResource("english","https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/langfr-225px-Flag_of_the_United_Kingdom_%283-5%29.svg.png",[45.78163627232091,4.863649606704712],"player",5,[])
        resourceEnglish.start = false;
        this.resources.push(resourceFrancais)
        this.resources.push(resourceEnglish)
    }

    /*
        Add a new user
    */
    addResource(resource) {
        this.resources.push(resource)
    }

    /*
        Update the position of a User. Return his ttl
    */
   updatePosition(id,position) {
    let index = this.resources.findIndex((resource => resource.id == id))
    this.resources[index].position = position
    return this.resources[index].ttl
   }


    /*
        Update the URL of a user
    */
    updateURL(id,url) {
        let index = this.resources.findIndex((resource => resource.id == id))
        this.resources[index].url = url
    }

    /*
        Update TTL users
    */
    updateAllTTL(ttl){
        this.resources.forEach(
            resource => {
                if(resource.role == "player"){
                    resource.ttl = ttl
                }}
        )
    }

    /*
        Decrement TTL users
    */
        decrementAllTTL(){
            this.resources.forEach(
                resource => {
                    if(resource.role == "player"){
                        if(resource.start == true) {
                            if (resource.ttl > 0) {
                                resource.ttl -= 1
                            }
                        } else {
                            resource.ttl = this.ttlMax
                        }
                        
                    }}
            )
        }

    /*
        Return the of resources of a user
    */
    getResourcesByID(id) {
        let res
        this.resources.forEach(
            resource => {
                
                if(resource.id === id){
                    res = resource
                }}
        )
        return res
    }

    /*
        Return the list of all the users of the game
    */

    getAllUsers() {
        let users = []
        this.resources.forEach(
            resource => {
                
                if(resource.role == "player"){
                    users.push(resource)
                }}
        )
        return users
    }

    /*
        return the list of all the objects of the game
    */
    getAllObjects() {
        let objects = []
        this.resources.forEach(
            resource => {
                
                if(resource.role != "player"){
                    objects.push(resource)
                }}
        )
        return objects
    }


    /*
        Allow a player to take a treasure if he is in the same position of the treasure
    */
    treasureRecovered() {
        let users = this.getAllUsers();
        users.forEach( 
            user => {
                let objects = this.getAllObjects();
                objects.forEach(
                    obj => {
                        if(obj.position[0] == user.position[0] && obj.position[1] == user.position[1]) { // if the position of the user is the same as the position of an object
                            let index = this.resources.findIndex((resource => resource.id == user.id)) // index of the user
                            this.resources[index].treasures.push(new Treasure(obj.id,obj.position,"")) // Add the treasure to the list of treasure of the user
                            index = this.resources.findIndex((resource => resource.id == obj.id && resource.position == obj.position)) // index of the object
                            this.resources.splice(index,1) // remove the treasure to the list of available resources
                        }
                    }
                )
            }
        )
    }

    start(id) {
        let index = this.resources.findIndex((resource => resource.id == id))
        this.resources[index].start = true
        this.resources[index].treasures = []
    }

    stop(id) {
        let index = this.resources.findIndex((resource => resource.id == id))
        this.resources[index].start = false
        this.resources[index].treasures = []
    }

    addChestToUser(idUser, idChest) {
        let index = this.resources.findIndex((resource => resource.id == idUser))
        this.resources[index].treasures.push(idChest);
        this.resources[index].treasures = [...new Set(this.resources[index].treasures)];
    }

    getAllChestOfUser(idUser) {
        let index = this.resources.findIndex((resource => resource.id == idUser))
        let chests = []
        let objects = this.getAllObjects();
        
        objects.forEach(
            obj => {
                if (this.resources[index].treasures.includes(obj.idChest)) { 
                    chests.push(obj);
                }
            }
        )
        return chests;
    }
}

module.exports.DAOResources = DAOResources;