<?php
/**
 * Created by PhpStorm.
 * User: Pieterjan Lambrecht
 * Date: 28/04/15
 * Time: 11:07
 */
?>
<!DOCTYPE html>
<html>
    <head>
        <title>IMGDrop</title>
        <link rel="stylesheet" href="kickstart.css" />
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script type="text/javascript" src="kickstart.js"></script>
        <script type="text/javascript" src="imgdrop.js"></script>
    </head>
    <body style="margin-top:30px">
        <div class="wrapper wrapper-fixed">
            <h1>IMGDrop</h1>
            <div class="container container-red">
                <header>
                    <p>Upload a file</p>
                </header>
                <main>
                    <progress id="progress" value="0" max="100"></progress>
                    <form id="file_form" enctype="multipart/form-data" class="form">
                        <div class="form_group">
                            <label for="file">Image</label>
                            <input id="file" type="file" name="file"><br>
                        </div>
                        <input type="submit" value="Upload">
                    </form>
                </main>
            </div>
        </div>
    </body>
</html>