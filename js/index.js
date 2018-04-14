$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});


/** 
 * Sends token to the server side script
 * To be inserted into DB
*/
$(document).ready(function(){
    getAllSpots();
});

function unsetCookie(name) {
    Cookies.remove(name);
}//end of unsetCookie()

function setCookie(name, value, expiration = null) {
    if(expiration != null) {
        Cookies.set(name, value, { expries: expiration });
    }
    else { 
        Cookies.set(name, value);
    }
}//end of setCookie()

function createToken() {
    let token = Math.random().toString(36).substr(2,8);

    if(Cookies.get('token') === null) {
        Cookies.set('token', token, { expires: 31 });
        setCookie('token', token, 31);
    }

    console.log("Token: " + Cookies.get('token'));
}

/* function sendToken() {
    $.ajax({
        url: 'datatest.php',
        dataType: 'JSON',
        data: 'token',

    });
} */

/**
 * Retrieves all locations that have the device 
 */
function getAllSpots() {

    $('#cards').empty();

    var cards = $('#cards');
    var all_cards = [];

    $.ajax({
        method: "POST",
        async: true,
        cache: false,
        url: "datatest.php",
        data: "locations",
        dataType: "JSON",
        success: function(response) {
            console.log(response);
            let data = '';

            for(let i = 0; i < response.length; i++) {
                let id = response[i][0].toLowerCase() + '-image';
                let path = '../vista/images/' + response[i][0].toLowerCase() + '.jpg';

                data += '<div class="demo-card-square mdl-card mdl-shadow--2dp mt-4 ml-1 d-flex justify-content-center">' +
                            '<div id="' + id + '" class="mdl-card__title mdl-card--expand">' +
                                '<h2 class="mdl-card__title-text">' + response[i][0] + '</h2>' +
                            '</div>' +
                            '<div class="mdl-card__supporting-text ml-2">' + response[i][4] + '</div>' +
                            '<div class="mdl-card__actions mdl-card--border">' +
                                '<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onclick="getLoc(\'' + response[i][0] + '\')">View More' +
                                '</a>' +
                            '</div>' +
                        '</div>';
                
                all_cards.push({ ajdi: '#' + id, pth: path });
            }
            cards.append(data);
            for(let i = 0; i < all_cards.length; i++) {
                console.log(all_cards[i]);
                $(all_cards[i].ajdi).css('background', 'url("' + all_cards[i].pth + '") bottom right 15% no-repeat #46B6AC');
            }
        }
    });

}//end of getAllSpots()

function getLoc(locName) {
    $.ajax({
        method: "POST",
        url: 'datatest.php',
        async: true,
        cache: false,
        data: { locName: locName },
        dataType: "JSON",
        beforeSend: function() {
            $("html, body").animate({ scrollTop: 0 }, "slow");
            $('body').children().not('.spinner').fadeOut(1500);
            $('.spinner').append('<i id="spinner" class="fa fa-circle-o-notch fa-spin" style="font-size:32px"></i>');
        },
        success: function(response) {
            setTimeout(function () {
                $('body').empty();
            } , 2000);
            console.log(response);
           let data = '';

           data = '<div id="location-title">' +
                        '<div class="col-12 pt-2 show">' +
                            '<span class="location-title pl-3">' + locName + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div id="location-content" class="container-fluid d-flex align-items-center mt-3">' + 
                        '<div class="d-flex flex-column show">' +
                            '<div class="d-flex flex-row mt-2">' +
                                '<div id="desc-title" class="col-12 pb-2">' +
                                    '<span class="description-title">Description:</span><br>' +
                                '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-row mt-3">' +
                                '<div class="col-12">' +
                                    '<span class="description">' + response[0][3] + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-row mt-2">' +
                                '<div id="loc-location" class="col-12 pb-2">' +
                                    '<span class="description-title">Location:</span><br>' +
                                '</div>' +
                            '</div>' +
                            '<div class="d-flex flex-row mt-3">' +
                                '<div class="col-12">' +
                                    '<div id="map"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';

            if(response.length === 0) {
                data += '<span>No images found. Please try again later.</span>';
            }
            else {
               data += '';
            }

           setTimeout(function() {
            $('body').append(data);
            createMap(parseFloat(response[0][1]), parseFloat(response[0][2]));
           }, 2000); 
        },
        error: function(msg) {
            console.log(msg);
            $('body').html('').append('<span>Data unavailable at the moment. Please try again later.</span>');
        }
    });

}//end of getLoc()

function test(){
    console.log("Loaded");
}

function createMap(latitude, longitude) {
    console.log(latitude + ' ' + longitude);
    let coords = new google.maps.LatLng(latitude, longitude);

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: coords
    });

    let marker = new google.maps.Marker({
        position: coords,
        map: map
    });

}//end of createMap()
/* function getLocationInfo(location) {

    var lat;
    var lng;
    navigator.geolocation.getCurrentPosition(function(position){
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        console.log(lat + ' ' + lng);
        getArea(lat, lng);
    },
    function(error){
        console.log(error);
    });    

} */

/* function getArea(lat, lng) {

    $.ajax({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=42.640994,18.1019012&key=AIzaSyBbGpevzk5Ip5vozwZk2PWNJLjT-ePmsCo',
        async: true,
        cache: false,
        dataType: "JSON",
        success:function(response) {
            console.log(response.results[0].place_id);
            let geocoder = new google.maps.Geocoder;

            geocoder.geocode({'placeId': response.results[0].place_id}, function(result,status){
                console.log(result);
            });
        }
    });

} */

function getNearbySpots() {
    
    var cards = $('#cards');

    $.ajax({
        method: "GET",
        async: true,
        url: "",
        cache: false,
        dataType: "JSON",
        success:function(response) {

            let data = '';
            console.log(response);
            /* for(let i = 0; i < response.length; i++) {

            } */

        },
        error:function(msg) {
            console.log("Error getting nearby spots..." + msg);
        }
    });

}

function upload(event) {
    let input = event.target.files;
}

  /*   let token = Math.random().toString(36).substr(2,8);

    $.ajax({
        method: "POST",
        cache: false,
        async: true,
        url: "",
        data: token,
        beforeSend: function(){

        },
        success: function(response){

        },
        error: function(message){

        }
    });
}//end of sendToken() */
