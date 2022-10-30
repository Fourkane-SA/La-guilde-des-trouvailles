apiPath = "http://192.168.75.46:3376/admin";
// initialisation de la map
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
	//updateMap();
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

/*
	Dessine un rectangle à la position actuelle de la ZRR
*/

function printRectangle() {
	$.ajax({
        type: 'GET',
        url: apiPath + "/",
        contentType: 'application/json',
        success: function(data){
			if(data.pos1.length  +  data.pos2.length == 4) { // vérifie que toutes les positions ont été initialisés
				var bounds = [[data.pos1[0], data.pos1[1]], [data.pos2[0], data.pos2[1]]];

				// create a black rectangle
				L.rectangle(bounds, {color: "#000000", weight: 1}).addTo(mymap);

				// zoom the map to the rectangle bounds
				mymap.fitBounds(bounds);
			}
			
		 }
     })

	
}

printRectangle();

/*
	Permet d'ajouter un coffre au clic sur la map lorsque la partie a commencé
*/

function addTreasure(position) { 
	let xmin = Math.min(resource.pos1[0],resource.pos2[0])
	let xmax = Math.max(resource.pos1[0],resource.pos2[0])
	let ymin = Math.min(resource.pos1[1],resource.pos2[1])
	let ymax = Math.max(resource.pos1[1],resource.pos2[1])
	if(position[0] >= xmin && position[0] <= xmax && position[1] >= ymin && position[1] <= ymax) { // Vérifie si on se trouve dans la ZRR
		L.marker([lat, lng], {icon: chestIcon}).addTo(mymap).bindPopup(resource.tresorType).openPopup(); // Ajoute un marqueur du nouveau coffre
		$.ajax({ // Requête permettant l'ajout du coffre dans l'API
			type: 'POST',
			url: apiPath + "/addChest",
			contentType: 'application/json',
			data: JSON.stringify({
				pos: position
			})
		})
	}
}

/*
	Permet l'affichage des ressources du jeu
*/

function printResources() {
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
					if(res.role == "player") { // Si la ressource est un joueur
						
						writePlayers(res) // On l'affiche dans la liste des aventuriers
					}
				}
			)
		 }
     })
}

/*
	Affiche d'un joueur en parametre avec son ttl
*/

function writePlayers(user) {
	let treasures = 0; // compte le nombre de trésor qu'il a obtenu
	user.treasures.forEach(
		res => {
			treasures++
		}
	)
	$("#sectionAventurier").children(".content").children(".users").append(`<a href="javascript:updateImage('Toto');"><img src="` + user.url + `" class="icon"></a>&nbsp;&nbsp;-&nbsp;&nbsp;
	<a href="javascript:updateName('` + user.id + `');">` + user.id + `</a>&nbsp;&nbsp;-&nbsp;&nbsp;
	<strong>TTL</strong> :` + user.ttl + `s&nbsp;&nbsp;-&nbsp;&nbsp;
	<strong>Trophys</strong> : ` + treasures + "<br>")
}

printResources()