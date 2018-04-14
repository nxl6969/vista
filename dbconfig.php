<?php
/**
 * Created by PhpStorm.
 * User: Nikola
 * Date: 30/01/2018
 * Time: 21:14
 */

function db_connect() {

    static $connection;

    if(!isset($connection)) {
        $config = parse_ini_file(stream_resolve_include_path("config.ini"));
        $connection = mysqli_connect('localhost',$config['username'],$config['password'],$config['dbname']);
    }

    if($connection === false) {
        return mysqli_connect_error();
    }
    return $connection;
}
