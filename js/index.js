$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});

var currentLocation = 'Lovrijenac';


/** 
 * Sends token to the server side script
 * To be inserted into DB
*/
$(document).ready(function(){
    getAllSpots();
    createToken();
});

function unsetCookie(name) {
    Cookies.remove(name);
}//end of unsetCookie()

function setCookie(name, value, expiration = null) {
    if(expiration != null) {
        Cookies.set(name, value, { expires: expiration });
    }
    else { 
        Cookies.set(name, value);
    }
}//end of setCookie()

function createToken() {
    let token = Math.random().toString(36).substr(2,8);

    if(Cookies.get('token') == null) {
        Cookies.set('token', token, { expires: 365 });
        //setCookie('token', token, 31);
    }

    //console.log("Token: " + Cookies.get('token'));
}

/**
 * Returns to homepage
 */
function back() {
    location.reload();
}

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
            let data = '';
            console.log(response);

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
                                '<a href="#directions" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect ml-5" onclick="getDirections(\'' + response[i][1] + ',' + response[i][2] + '\')">See Directions' + 
                                '</a>' + 
                            '</div>' +
                        '</div>';
                
                all_cards.push({ ajdi: '#' + id, pth: path });
            }
            cards.append(data);
            for(let i = 0; i < all_cards.length; i++) {
                $(all_cards[i].ajdi).css('background', 'url("' + all_cards[i].pth + '") bottom right 15% no-repeat #46B6AC');
            }
        }
    });

}//end of getAllSpots()

/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 */
function getDirections(latitude, longitude) {
   
    var currLat;
    var currLng;

    navigator.geolocation.getCurrentPosition(function(position){
        currLat = parseFloat(position.coords.latitude);
        currLng = parseFloat(position.coords.longitude);
        Cookies.set('currLat', currLat);
        Cookies.set('currLng', currLng); 
    },
    function(msg){
        console.log("Error: " + msg);
    },
    { enableHighAccuracy: true });

    drawRoute(parseFloat(latitude.split(',')[0]), parseFloat(latitude.split(',')[1]), Cookies.get('currLat'), Cookies.get('currLng'));

}//end of getDirections()

/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} newLat 
 * @param {*} newLng 
 */
function drawRoute(latitude,longitude, newLat, newLng) {    

    let ori = new google.maps.LatLng(newLat, newLng);
    let dest= new google.maps.LatLng(latitude, longitude);

    var map = new google.maps.Map(document.getElementById('map-directions'), 
    {
        zoom: 14,
        center: ori,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false 
    });

    $('#directions').show().fadeIn(1000);
    $('#directions-content').empty();

    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    });

    directionsService.route(
        { 
            origin: ori, 
            destination: dest, 
            travelMode: google.maps.TravelMode.WALKING
        },
        function(response, status){
            console.log(response);
            if(status == 'OK') {
                console.log(response);
                directionsDisplay.setDirections(response);
                
                let data = '';
                let pdfData = '';
                let counter = 1;
                var pdf = new jsPDF({
                    orientation: 'portrait',
                    units: 'cm',
                    format: [500, 500]
                });

                let steps = response.routes[0].legs[0].steps;

                for(let i = 0; i < steps.length; i++) {
                    
                    data += '<div class="d-flex flex-row mb-3">' +
                                '<div class="col-12">' +
                                    '<div class="steps-div">' + 
                                        '<span class="step-num mr-2">Step#' + counter + '</span><br>' + 
                                        '<span class="steps-text">In ' + steps[i].distance.text + ' ' + steps[i].instructions + '</span>' + 
                                    '</div>' +
                                '</div>' +
                            '</div>';
                    pdfData += 'Step#' + counter + ') In' + $(steps[i].distance.text).find('<b>').replace('') + ' ' + steps[i].instructions; 
                    counter++;
                }

                let btn = '<input id="pdf-btn" type="button" value="Download Steps"/>';
                $('#directions-content').append(data);
                $('#directions-content').append(btn);

                pdf.text(pdfData, 5, 5);

                $('#pdf-btn').on('click', function() {
                    pdf.save('steps_description.pdf');
                });
            }
            else {
                console.log('Unable to find route');
            }
    });
}//end of drawRoute()

function createPDF(data) {
    console.log(data);
    var document = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [3, 5]
    });
    document.text(data);
    $('#pdf-btn').on('click', function(){
        document.save('steps.pdf');
        //document.output()
    });

}

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
           let data = '';
           let images = '';
      
            if(response.length === 0) {
                data = '<div id="location-title">' +
                            '<div class="d-flex col-12 pt-1">' +
                                '<span class="location-title pl-3">' + locName + '</span>' +
                                '<span id="back-btn" class="pt-2" onclick="back()">Back</span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="d-flex flex-row">' + 
                            '<span class="error-msg pl-3 m-3">Data unavailable. Please try again later.</span>' +
                        '</div>';
            }
            else {

                data = '<div id="location-title">' +
                            '<div class="d-flex col-12 pt-1">' +
                                '<span class="location-title pl-3">' + locName + '</span>' +
                                '<span id="back-btn" class="pt-2" onclick="back()">Back</span>' +
                            '</div>' +
                        '</div>' +
                        '<div id="location-content" class="container-fluid d-flex align-items-center mt-3">' + 
                            '<div class="d-flex flex-column">' +
                                '<div class="d-flex flex-row mt-2">' +
                                    '<div id="desc-title" class="col-12 pb-2">' +
                                        '<span class="description-title">Description</span><br>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="d-flex flex-row mt-3">' +
                                    '<div class="col-12">' +
                                        '<span class="description">' + response[0][3] + '</span>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="d-flex flex-row mt-2">' +
                                    '<div id="loc-location" class="col-12 pb-2">' +
                                        '<span class="description-title">Location</span><br>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="d-flex flex-row mt-3">' +
                                    '<div class="col-12">' +
                                        '<div id="map"></div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' + 
                        '</div>' + 
                        '<div class="container-fluid mt-3">' +
                            '<div id="previous-pics" class="pb-2 mb-3">' +
                                '<span class="description-title">Previous pictures</span>' +
                            '</div>' + 
                        '</div>';
                var id;
                for(let i = 0; i < response.length; i++) {
                    let path = 'images/' + response[i][0];
                    data += '<div class="container-fluid d-flex mt-1 mb-3">' +
                                '<div class="container-fluid d-flex flex-row">' + 
                                    '<div class="demo-card-square mdl-card mdl-shadow--2dp">'+
                                        '<div class="mdl-card__title mdl-card--expand bg-cover" style="background-image:url(' + path + ')">' +
                                        '</div>' +
                                        '<div class="mdl-card__actions">' +
                                            '<span class="image-tags">Uploaded on: ' + response[i][4] + '</span>' +
                                        '</div>' +
                                        '<div class="mdl-card__actions mdl-card--border">' +
                                            '<span class="image-tags">Tags: ' + response[i][5] + '</span>' +
                                        '</div>' +
                                        '</div>' +
                                '</div>' +
                            '</div>';
               }//end of for loop

            }//end of else

           setTimeout(function() {
            $('body').append(data);
            createMap(parseFloat(response[0][1]), parseFloat(response[0][2]));
           }, 2000); 

        }//end of success function
    });

}//end of getLoc()

/**
 * Creates Map for specified location
 * @param {*} latitude 
 * @param {*} longitude 
 */
function createMap(latitude, longitude) {
    let coords = new google.maps.LatLng(latitude, longitude);

    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: coords,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

    let marker = new google.maps.Marker({
        position: coords,
        map: map
    });

}//end of createMap()

$('#sendButton').on('click', function() {

    //form_data.append("file", $('form')[0]);

    var formData = new FormData($('form')[0]);
    formData.append('token', Cookies.get('token'));
    formData.append('location', currentLocation);

    $.ajax({
        // Your server script to process the upload
        url: 'datatest.php',
        type: 'POST',

        // Form data
        data: formData,

        // Tell jQuery not to process data or worry about content-type
        // You *must* include these options!
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        $('progress').attr({
                            value: e.loaded,
                            max: e.total,
                        });
                    }
                } , false);
            }
            return myXhr;
        },
        success: function(response){
            console.log(response);
            if( (response !== 'fail') || (response.length > 0) ){
                Cookies.set('token', response, {expires: 365});
            }

        }


    });
});