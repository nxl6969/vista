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

    let token = Math.random().toString(36).substr(2,8);
    Cookies.set('token', token, { expires: 31 });
    console.log("Token: " + Cookies.get('token'));

    /* $.ajax({
        method: "POST",
        async: true,
        cache: false,
        success:function(response){
            console.log(response);
        },
        error:function(msg) {
            console.log("Error: " + msg);
        }
    }); */

    getNearbySpots();

});

function unsetCookie(name) {
    Cookies.remove(name);
}//end of

function setCookie(name, value, expiration = null) {
    if(expiration != null) {
        Cookies.set(name, value, { expries: expiration });
    }
    else { 
        Cookies.set(name, value);
    }
}

function sendToken() {
    $.ajax({

    });
}

function getAllSpots() {
    $.ajax({
        method: "POST",
        async: true,
        cache: false,
        url: "data-handler.php",
        data: "locations",
        dataType: "JSON",
        success: function(response) {
            console.log(response);
        },
        complete: function(){

        }
    });
}

function checkDistance() {

}

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
