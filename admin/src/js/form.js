import './map.js';
var apiPath = "http://localhost:3376/admin";
import $ from 'jquery';

// MàJ de l'indicateur numérique du zoom
function updateZoomValue() {
    $('#zoomValue').html($('#zoom').val());
    updateMap();
}

function updateMap() {
	// Affichage à la nouvelle position
	mymap.setView([lat, lng], zoom);

	// La fonction de validation du formulaire renvoie false pour bloquer le rechargement de la page.
	return false;
}
// Abonnement aux événements de changement
$('#lat').change(updateMap);
$('#lon').change(updateMap);
//$('#zoom').change(updateZoomValue);

function updateCorner1() {
    $('#lat1').val(lat);
    $('#lon1').val(lng);
}

function updateCorner2() {
    $('#lat2').val(lat);
    $('#lon2').val(lng);
}

function sendPosition() {
    $.ajax({
        type: 'POST',
        url: apiPath + "/updatePosition",
        contentType: 'application/json',
        data: JSON.stringify({
            pos1: [parseFloat($('#lat1').val()), parseFloat($('#lon1').val())],
            pos2: [parseFloat($('#lat2').val()), parseFloat($('#lon2').val())]
        })
    })
}

function start() {

    $.ajax({
        type: 'POST',
        url: apiPath + "/start",
        contentType: 'application/json',
        data: JSON.stringify({
            ttl: parseInt($('#ttl').val()),
            tresorType: $('#treasure').val()
        })
    })
}

function getresources() {
    $.ajax({
        type: 'GET',
        url: apiPath + "/",
        contentType: 'application/json',
        success: function (data) {
            resource = data
            if (resource.start == true) {
                $('#sectionSet').hide();
                $('#sectionParametre').hide();
                $('#sectionAventurier').show();
            } else {
                $('#sectionSet').show();
                $('#sectionParametre').show();
                $('#sectionAventurier').hide();
            }
        }
    })
}

getresources();