<?php
/**
 * Created by PhpStorm.
 * User: Pieterjan Lambrecht
 * Date: 28/04/15
 * Time: 11:07
 */
// Get key of image from URL
$exists = false;
if(isset($_GET) && key($_GET)){
    $file = key($_GET);
    if(file_exists("uploads/" . $file)
        && strpos($file,'\\') === false
        && strpos($file,'/') === false
        && strpos($file,'.') === false){
        $image = glob("uploads/" . $file);
        $exists = true;
    }
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>IMGDrop</title>
        <link rel="stylesheet" href="kickstart.css" />
        <script type="text/javascript" src="imgdrop.js"></script>
    </head>
    <body>
        <?php
            if($exists){
                echo '<img src="' . $image[0] . '"/>';
            } else {
                echo '<div style="margin-top:30px" class="wrapper wrapper-fixed">
                        <h1>File not found</h1>
                      </div>';
            }
        ?>
    </body>
</html>