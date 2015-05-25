<?php
/**
 * Created by PhpStorm.
 * User: Pieterjan Lambrecht
 * Date: 28/04/15
 * Time: 11:07
 */
echo print_r($_FILES);
if($_FILES["file"] != null) {
    // Extra information about the file
    $filename = $_FILES["file"]["name"];
    $tmp = $_FILES["file"]["tmp_name"];
    $type = $_FILES["file"]["type"];
    $size = $_FILES["file"]["size"];
    // Check if it's an image and is not too big
    if(substr($type, 0, 6) !== "image/") {
        echo json_encode(array("error" => "Please check type of file - " . $type));
        http_response_code(400);
    } else if ($size > 5000000) {
        echo json_encode(array("error" => "Please check size of file"));
        http_response_code(413);
    } else {
        $name = createFilename();
        if(!move_uploaded_file($tmp, "uploads/" . $name)){
            echo json_encode(array("error" => "Error storing file, please try again"));
            http_response_code(500);
        } else {
            // Change last modified to now for the cron job
            touch("uploads/" . $name);
            echo json_encode(array("name" => $name));
        }
    }
}

function createFilename() {
    // http://stackoverflow.com/questions/19017694/1line-php-random-string-generator
    $name = substr( "abcdefghijklmnopqrstuvwxyz" ,mt_rand( 0 ,25 ) ,1 ) .substr( md5( time( ) ) ,1 );
    // Check if file already exists
    if(!file_exists("uploads/" . $name)){
        return $name;
    } else {
        return createFilename();
    }
}
