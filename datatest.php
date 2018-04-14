<?php
/**
 * Created by PhpStorm.
 * User: Nikola
 * Date: 14.4.2018.
 * Time: 10:49
 */

require "dbconfig.php";



if(isset($_POST['token']) && isset($_POST['url']) && isset($_POST['location'])){

   // $token = $_POST['token'];
    $mysqli = db_connect();
    //$token = $_POST['token'];
    $url = $_POST['url'];
    $location = $_POST['location'];

    $token = password_hash($_POST['token'], PASSWORD_DEFAULT);

    $sql = "INSERT INTO user (user_id, token) VALUES (NULL, ?)";

    if ($stmt = $mysqli->prepare($sql)){
        $stmt->bind_param('s', $token);
        if ($stmt->execute()) {

            $sql = "INSERT INTO image (user_id, image_path, location) VALUES ((SELECT user_id FROM user WHERE
            token = ?), ?, (SELECT location_id FROM location WHERE location = ?))";

            if($stmt = $mysqli->prepare($sql)){
                $stmt->bind_param('sss', $token, $url, $location);

                if($stmt->execute()){
                    echo $token;
                }
            }


        }else{
            echo 'fail';
        }

    }

}

if(isset($_POST['locations'])){

    $mysqli = db_connect();

    $sql = "SELECT name, lat, lng, description, tags FROM location";

    if($stmt = $mysqli->prepare($sql)){

        if($stmt->execute()){

            $stmt->store_result();

            $stmt->bind_result($name, $lat, $long, $desc, $tags);
            $result = [];

            while($stmt->fetch()){
                array_push($result, array($name, $lat, $long, $desc, $tags));
            }

            echo json_encode($result);


        }

    }


}

if(isset($_POST['locName'])){

    $mysqli = db_connect();
    $locName = $_POST['locName'];

    $sql = "SELECT image.image_path, location.lat, location.lng, location.description FROM image LEFT JOIN location ON image.location = location.location_id WHERE location.name = ?";

    if($stmt = $mysqli->prepare($sql)) {

        $stmt->bind_param('s', $locName);

        if ($stmt->execute()) {

            $stmt->store_result();

            $stmt->bind_result($path, $lat, $lng, $desc);
            $result = [];

            while($stmt->fetch()){
                array_push($result, array($path, $lat, $lng, $desc));
            }
            echo json_encode($result);
        }
    
    }

}