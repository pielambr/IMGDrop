<?php
/**
 * User: Pieterjan Lambrecht
 */
?>
<!DOCTYPE html>
<html>
    <head>
        <title>IMGDrop</title>
        <link rel="stylesheet" href="kickstart.css" />
        <script type="text/javascript" src="imgdrop.js"></script>
    </head>
    <body>
        <div style="margin-top:30px" class="wrapper wrapper-fixed">
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