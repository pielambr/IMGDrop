/**
 * Created by Pieterjan Lambrecht on 28/04/15.
 */
$(document).ready(function(){
    $("#file_form").submit(upload);
    $(document).on('paste', 'body', paste);
});

function paste(ev) {
    ev.preventDefault();
    var clipboard = (ev.clipboardData || ev.originalEvent.clipboardData);
    if(clipboard.items[0] && clipboard.items[0].type.indexOf("image/") != -1){
        var image = clipboard.items[0].getAsFile();
        upload(null, image);
    }
};

function upload(ev, image) {
    console.log("Uploading...");
    if(ev){
        ev.preventDefault();
    }
    //
    var d = new FormData(this);
    if(image){
        d.append("file", image, "screenshot.png");
    }
    // Send file to the server
    $.ajax({
        xhr: function() {
            var xhr = new XMLHttpRequest();
            xhr.onprogress = function(evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    $("#progress").val(parseInt(percentComplete * 100));
                }
            };
            xhr.onloadend = function(){
                $("#progress").val(100);
            };
            return xhr;
        },
        url: "upload.php",
        type: "POST",
        data: d,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function(result) {
            console.log(result.name);
            if(result.name){

                window.location = "view.php?" + result.name;
            }
        }
    });
};