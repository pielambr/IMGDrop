<?php
/**
 * Created by PhpStorm.
 * User: Pieterjan Lambrecht
 * Date: 28/04/15
 * Time: 11:07
 */
// Get key of image from URL
$exists = false;
if($_GET && key($_GET)){
    $file = key($_GET);
    if(file_exists("uploads/" . $file)){
        $image = glob("uploads/" . $file);
        $exists = true;
    }
}

?>
<!DOCTYPE html>
<html>
    <head>
        <title>ImgDrop</title>
        <link rel="stylesheet" href="kickstart.css" />
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript" src="kickstart.js"></script>
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