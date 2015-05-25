/**
 * Created by Pieterjan Lambrecht on 28/04/15.
 * Credits:
 * http://joelb.me/blog/2011/code-snippet-accessing-clipboard-images-with-javascript/
 * https://bug407983.bugzilla.mozilla.org/attachment.cgi?id=292749
 * http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
 */

window.onload = function () {
    IMGDrop.init();
};

var IMGDrop = {
    dataToBlob: function (dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString = atob(dataURI.split(',')[1]);
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    },
    addPasteRegio: function () {
        var that = this;
        this.regio = document.createElement("div");
        this.regio.setAttribute("contenteditable", "");
        this.regio.setAttribute("position", "absolute");
        this.regio.setAttribute("left", "-999px");
        this.regio.style.opacity = 0;
        document.body.appendChild(this.regio);
        this.regio.focus();
        document.addEventListener("click", function () {
            that.regio.focus()
        });
    },
    paste: function (ev) {
        var that = this;
        var data = ev.clipboardData || window.clipboardData;
        if (data.items) {
            if (data.items[0] && data.items[0].type.indexOf("image/") !== -1) {
                var image = data.items[0].getAsFile();
                if (image) {
                    this.upload(image);
                }
            }
        } else {
            setTimeout(function () {
                that.checkPasteRegio();
            }, 1);
        }
    },
    checkPasteRegio: function () {
        var pasted = this.regio.childNodes[0];
        this.regio.innerHTML = ""
        if (pasted && pasted.tagName === "IMG") {
            blob = this.dataToBlob(pasted.src);
            this.upload(blob);
        }
    },
    upload: function (image) {
        var progress = this.progress;
        var data = image ? new FormData() : new FormData(this.form);
        if(image) {
            data.append("file", image, "screenshot.png");
        }
        // Send file to the server
        var request = new XMLHttpRequest();
        request.open("POST", "upload.php");
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var result = JSON.parse(this.responseText);
                    window.location = "view.php?" + result.name;
                } else if (request.status === 413) {
                    alert("File is too big, please try a smaller file!");
                } else {
                    alert("An unknown error happened while uploading your file");
                }
            }
        };
        request.upload.onprogress = function (ev) {
            if (ev.lengthComputable) {
                var percentComplete = ev.loaded / ev.total;
                progress.value = parseInt(percentComplete * 100);
            }
        };
        request.upload.onload = function (ev) {
            progress.value = 100;
        };
        request.send(data);
    },
    init: function () {
        var that = this;
        this.progress = document.getElementById("progress");
        this.form = document.getElementById("file_form");
        if(this.form){
            this.form.onsubmit = function(ev) {
                ev.preventDefault();
                that.upload();
            }
        }
        document.addEventListener('paste', function (ev) {
            that.paste(ev);
        });
        this.addPasteRegio();
    }
};