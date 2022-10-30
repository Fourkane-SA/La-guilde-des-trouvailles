var apiPath = "http://192.168.75.46:3376/admin";
var resource = ""

// MàJ de l'indicateur numérique du zoom
function updateZoomValue() {
    $('#zoomValue').html($('#zoom').val());
    updateMap();
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
            if (resource.start == true) { // affiche les sections selon l'état de la peartie
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

function stopParty() {
    $.ajax({
        type:'POST',
        url: apiPath + "/stop"
    })
}

getresources();