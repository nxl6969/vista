<?php
/**
 * Created by PhpStorm.
 * User: Nikola
 * Date: 14.4.2018.
 * Time: 10:49
 */

require "dbconfig.php";



if(isset($_POST['token']) && isset($_POST['url'])){

   // $token = $_POST['token'];
    $mysqli = db_connect();
    $token = 'asdasdadasda';

    $sql = "INSERT INTO user (user_id, token) VALUES (NULL, ?)";

    if ($stmt = $mysqli->prepare($sql)){
        $stmt->bind_param('s', $token);
        if ($stmt->execute()) {
            echo 'success';
        }else{
            echo 'rip';
        }

    }

}

if(isset($_POST['locations'])){

    $mysqli = db_connect();

    $sql = "SELECT name, lat, lng, description FROM location";

    if($stmt = $mysqli->prepare($sql)){

        if($stmt->execute()){

            $stmt->store_result();

            $stmt->bind_result($name, $lat, $long, $desc);
            $result = [];

            while($stmt->fetch()){
                array_push($result, array($name, $lat, $long, $desc));
            }

            echo json_encode($result);


        }

    }


}