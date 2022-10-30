import './form.js';
var apiPath = "http://localhost:3376/admin";

//var L = require('leaflet');
// initialisation de la map
import L from "leaflet";
defaultIcon = L.icon({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});
let lat = 45.782, lng = 4.8656, zoom = 19;

let mymap = L.map('map', {
    center: [lat, lng],
    zoom: zoom
});
//updateMap();

// Création d'un "tile layer" (permet l'affichage sur la carte)
L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg90?access_token=pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA', {
		maxZoom: 22,
		minZoom: 1,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1IjoibTFpZjEzIiwiYSI6ImNqczBubmhyajFnMnY0YWx4c2FwMmRtbm4ifQ.O6W7HeTW3UvOVgjCiPrdsA'
	}).addTo(mymap);

// Ajout d'un marker
L.marker([45.78207, 4.86559]).addTo(mymap).bindPopup('Entrée du bâtiment<br><strong>Nautibus</strong>.').openPopup();

//L.Icon.Default.imagePath = '../../lib/leaflet/dist/images/';
var LeafIcon = L.Icon.extend({
    options: {
       iconSize:     [38, 95],
       shadowSize:   [50, 64],
       iconAnchor:   [22, 94],
       shadowAnchor: [4, 62],
       popupAnchor:  [-3, -76]
    }
});

var chestIcon = new LeafIcon({
    iconUrl: 'https://static.berceaumagique.com/photo/c5/5a/166826/400/1/lot-de-8-contenants-a-confiserie-coffre-au-tresor-pirate.jpg?1'
})

// Clic sur la carte
mymap.on('click', e => {
	lat = e.latlng.lat;
	lng = e.latlng.lng;
	if(resource.start == true){
		addTreasure([lat, lng]);
	}
	updateMap();
});

// Mise à jour de la map
function updateMap() {
	// Affichage à la nouvelle position
	mymap.setView([lat, lng], zoom);

	// La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
	return false;
}

// mymap.attributionControl._map._animateToCenter['lng']
// mymap.attributionControl._map._animateToCenter['lat']

function printRectangle() {
	$.ajax({
        type: 'GET',
        url: apiPath + "/",
        contentType: 'application/json',
        success: function(data){
			if(data.pos1.length  +  data.pos2.length == 4) { // vérifie que toutes les positions ont été initialisés
				var bounds = [[data.pos1[0], data.pos1[1]], [data.pos2[0], data.pos2[1]]];

				// create an orange rectangle
				L.rectangle(bounds, {color: "#000000", weight: 1}).addTo(mymap);

				// zoom the map to the rectangle bounds
				mymap.fitBounds(bounds);
			}
			
		 }
     })

	
}

printRectangle();

function addTreasure(position) {
	let xmin = Math.min(resource.pos1[0],resource.pos2[0])
	let xmax = Math.max(resource.pos1[0],resource.pos2[0])
	let ymin = Math.min(resource.pos1[1],resource.pos2[1])
	let ymax = Math.max(resource.pos1[1],resource.pos2[1])
	if(position[0] >= xmin && position[0] <= xmax && position[1] >= ymin && position[1] <= ymax) {
		L.marker([lat, lng], {icon: chestIcon}).addTo(mymap).bindPopup(resource.tresorType).openPopup();
		$.ajax({
			type: 'POST',
			url: apiPath + "/addChest",
			contentType: 'application/json',
			data: JSON.stringify({
				pos: position
			})
		})
	}
}

function printPlayers() {
	$.ajax({
        type: 'GET',
        url: apiPath + "/resources",
        contentType: 'application/json',
        success: function(data){
			data.resources.forEach(
				res => {
					var userIcon = new LeafIcon({
						iconUrl: res.url
					})
					L.marker(res.position, {icon: userIcon}).addTo(mymap).bindPopup(res.id).openPopup();
					if(res.role == "player") {
						
						writePlayers(res)
					}
				}
			)
		 }
     })
}

function writePlayers(user) {
	let treasures = 0;
	console.log(user.treasures)
	user.treasures.forEach(
		res => {
			treasures++
		}
	)
	$("#sectionAventurier").children(".content").children(".users").append(`<a href="javascript:updateImage('Toto');"><img src="` + user.url + `" class="icon"></a>&nbsp;&nbsp;-&nbsp;&nbsp;
	<a href="javascript:updateName('` + user.id + `');">` + user.id + `</a>&nbsp;&nbsp;-&nbsp;&nbsp;
	<strong>TTL</strong> :` + user.ttl + `s&nbsp;&nbsp;-&nbsp;&nbsp;
	<strong>Trophys</strong> : ` + treasures + "<br>")
	
	/*
	<a href="javascript:updateImage('Toto');"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Pediculus_humanus_var_capitis.jpg/800px-Pediculus_humanus_var_capitis.jpg?uselang=fr" alt="Pediculus humanus var capitis AKA head louse; public domain from http://phil.cdc.gov/" class="icon"></a>&nbsp;&nbsp;-&nbsp;&nbsp;
					<a href="javascript:updateName('Toto');">Toto</a>&nbsp;&nbsp;-&nbsp;&nbsp;
					<strong>TTL</strong> : 180s&nbsp;&nbsp;-&nbsp;&nbsp;
					<strong>Trophys</strong> : none
	*/
}

printPlayers()