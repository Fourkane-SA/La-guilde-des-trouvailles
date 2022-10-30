var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const jwt_decode = require("jwt-decode");

var {DAOResources} = require('../DAO/DAOResources')
const res = require('express/lib/response');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

global.DAOResource = new DAOResources() // variable globale
var APIUser = 'https://192.168.75.46:8443/users'
global.token = '' // variable globale pour le token

/* POST : Retrieves the token */
router.post('/login',function(req,res,next) {
        axios.post(
            "http://localhost:8080/login?login=francais&password=motdepasse&Origin=http://localhost:8080" 
          )
          .then((response) => {
            global.token = response.headers.authentication;
            res.status(200);
            res.end();
          })
})

/* GET : Returns an array containing the representations of all existing resources in the game 
if the user is alive, or only that of the user if she is dead */
router.get('/', function(req, res, next) {
    token = req.headers.authorization == '' ? global.token : req.headers.authorization
    res.setHeader('Content-Type', 'application/json');
    try {
        var decoded = jwt_decode(token);
        var login = decoded.sub
        console.log(login)
        if (global.DAOResource.getResourcesByID(login).ttl == 0) { // Si l'utilisateur est mort
            res.end(JSON.stringify(global.DAOResource.getResourcesByID(login)))
        }
        else {
            res.end(JSON.stringify(global.DAOResource));// On envoie toutes les ressources du jeu
        }
    } catch (error) {
        console.log(error)
        res.status(401)
        res.end()
    }
        
    
});
/* PUT : Send a LatLng object to the server. Retrieve a TTL in response. */
router.put('/:id', function(req, res, next) {
    token = req.headers.authorization == '' ? global.token : req.headers.authorization
        try { 
            var decoded = jwt_decode(token);

            var login = decoded.sub
            if (login == req.params.id) { // verifie que l'utilisateur modifie sa position
                if (Array.isArray(req.body)) { // Vérifie qu'on a bien un tableau dans le body de la requête
                    res.status(200)
                    let ttl = global.DAOResource.updatePosition(login, req.body)
                    res.end(JSON.stringify(ttl)) //Afficher le ttl
                } else { // Le body a un format incorrect
                    res.status(400)
                    res.end()
                }
            } else { // L'utilisateur essaye de modifier la position d'un autre utilisateur
                res.status(403)
                res.end()
            }
        } catch (error) { // Le token est incorrect
            console.log(error)
            res.status(401)
            res.end()
        }    
})

/* PUT : Sets or updates the user's photo/icon/... image file URL */
router.put('/:id/image', function(req, res, next) {
    token = req.headers.authorization == '' ? global.token : req.headers.authorization
        try {
            var decoded = jwt_decode(token);

            var login = decoded.sub
            if (login == req.params.id) { // verifie que l'utilisateur modifie sa photo
                if (req.body.url != null) { // Vérifie qu'on a bien un string dans le body de la requête 
                    res.status(204)
                    global.DAOResource.updateURL(login, req.body.url)
                    res.end()
                } else { // Le body a un format incorrect
                    res.status(400)
                    res.end()
                }
            } else { // L'utilisateur essaye de modifier la photo d'un autre utilisateur
                res.status(403)
                res.end()
            }
        } catch (error) { // Le token est incorrect
            res.status(401)
            res.end()
        }
        
    
});

router.get('/chest', function (req, res, next) {
    res.status(200)
    res.end(JSON.stringify(global.DAOResource.getAllObjects()));
})

// Permet à l'utilisateur de démarrer sa partie
router.post('/:id/start', function (req, res, next) {
    token = req.headers.authorization == '' ? global.token : req.headers.authorization
            try {
                var decoded = jwt_decode(token);

                var login = decoded.sub
                if (login == req.params.id) { // verifie que l'utilisateur veut démarrer sa partie
                    global.DAOResource.start(login)
                    res.end()
                } else { // L'utilisateur essaye de démarrer une autre partie
                    res.end()
                }
            } catch (error) { // Le token est incorrect
                res.status(401)
                res.end()
            }
        
});

// Permet à l'utilisateur d'arreter sa partie
router.post('/:id/stop', function (req, res, next) {
    token = req.headers.authorization == '' ? global.token : req.headers.authorization
            try {
                var decoded = jwt_decode(token);

                var login = decoded.sub
                if (login == req.params.id) { // verifie que l'utilisateur veut démarrer sa partie
                    global.DAOResource.stop(login)
                    res.end()
                } else { // L'utilisateur essaye de démarrer une autre partie
                    res.end()
                }
            } catch (error) { // Le token est incorrect
                res.status(401)
                res.end()
            }
});

// Permet l'ajout d'un coffre
router.put('/:id/chest', function (req, res, next) {
    token = req.headers.authorization == '' ? global.token : req.headers.authorization
            try {
                var decoded = jwt_decode(token);

                var login = decoded.sub
                if (login == req.params.id) { // verifie que l'utilisateur ajoute un de ses coffres
                    if (req.body.idChest != null) { // Vérifie qu'on a bien un id dans la requete
                        res.status(204)
                        global.DAOResource.addChestToUser(login, req.body.idChest)
                        res.end()
                    } else { // Le body a un format incorrect
                        res.status(400)
                        res.end()
                    }
                } else { // L'utilisateur essaye de modifier un autre coffre
                    res.status(403)
                    res.end()
                }
            } catch (error) { // Le token est incorrect
                res.status(401)
                res.end()
            }
        
});

router.get('/:id/chests', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(global.DAOResource.getAllChestOfUser(req.params.id)));
});

function decrement() { // Fonction de callback
    global.DAOResource.decrementAllTTL()
}

this.timer = setInterval(decrement, 1000); // Appellle decrement toutes les secondes

module.exports = router;
