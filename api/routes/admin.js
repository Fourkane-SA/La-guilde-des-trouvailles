var express = require('express');
var router = express.Router();

var { DAOAdmin } = require('../DAO/DAOAdmin')
var { DAOResources } = require('../DAO/DAOResources')
var {GeoResource} = require('../models/GeoResource')
const res = require('express/lib/response');

var DAOadmin = new DAOAdmin()
var APIUser = 'https://192.168.75.46:8443/users'
var idChest = 0;
/* GET : returns 2 array positions  */
router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.end(JSON.stringify(DAOadmin));
});

/* POST : 2 array positions  */
router.post('/updatePosition', function (req, res, next) {
    DAOadmin.changePosition(req.body.pos1[0],req.body.pos1[1], req.body.pos2[0], req.body.pos2[1]);
    res.status(200);
    res.end();
});

router.post('/start', function (req, res, next) {
    DAOadmin.tresorType = req.body.tresorType;
    DAOadmin.ttl = req.body.ttl;
    global.DAOResource.ttlMax = req.body.ttl;
    DAOadmin.start = true;
    global.DAOResource.updateAllTTL(DAOadmin.ttl);
    res.status(200);
    res.end();
});

router.post('/addChest', function (req, res, next) {
    var newResource = new GeoResource(DAOadmin.tresorType,"https://static.berceaumagique.com/photo/c5/5a/166826/400/1/lot-de-8-contenants-a-confiserie-coffre-au-tresor-pirate.jpg?1",req.body.pos,"object")
    newResource.open = false; // créé un attribut open (initialisé à false)
    newResource.idChest = idChest;
    idChest++;
    res.status(200);
    global.DAOResource.resources.push(newResource)
    res.end();
});

router.get('/resources', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.end(JSON.stringify(global.DAOResource));
});

router.get('/treasureRecovered', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    global.DAOResource.treasureRecovered()
    res.end();
});

router.post('/stop', function (req, res, next) {
    DAOadmin.start = false;
    res.status(200);
    res.end();
});

module.exports = router;
