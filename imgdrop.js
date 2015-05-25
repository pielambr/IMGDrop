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
    addCropMenu: function() {
        var that = this;
        var menu = document.createElement("div");
        menu.style.position = "fixed";
        menu.style.background = "rgba(0, 0, 0, 0.5)";
        menu.style.right = "0px";
        menu.style.top = "0px";
        var apply = document.createElement("input");
        apply.style.margin = "5px";
        apply.type = "submit";
        apply.value = "Apply";
        apply.onclick = function() {
            var canvas = document.createElement("canvas");
            var width = Math.abs(that.coords.x2 - that.coords.x1);
            var height = Math.abs(that.coords.y2 - that.coords.y1);
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            var image = document.getElementsByTagName("img")[0];
            ctx.drawImage(image,
                Math.min(that.coords.x1, that.coords.x2),
                Math.min(that.coords.y1, that.coords.y2),
                width, height, 0, 0, width, height);
            canvas.toBlob(that.upload);
        }
        var reset = document.createElement("input");
        reset.style.margin = "5px";
        reset.type = "submit";
        reset.value = "Reset";
        reset.onclick = function() {
            that.coords.x1 = 0;
            that.coords.x2 = 0;
            that.coords.y1 = 0;
            that.coords.y2 = 0;
            that.drawSelection()
        }
        menu.appendChild(apply);
        menu.appendChild(reset);
        document.getElementsByTagName("body")[0].appendChild(menu);
    },
    drawImage: function (image) {
        var body = document.getElementsByTagName("body")[0];
        body.innerHTML = "";
        var URLObj = window.URL || window.webkitURL;
        var source = URLObj.createObjectURL(image);
        var img = new Image();
        img.src = source;
        img.onmousedown = function() {
            return false;
        }
        body.appendChild(img);
        this.selection = document.createElement("div");
        this.selection.style.position = "absolute";
        this.selection.style.border = "2px red solid";
        body.appendChild(this.selection);
    },
    drawSelection: function() {
        var body = document.getElementsByTagName("body")[0];
        body.removeChild(this.selection);
        var width = Math.abs(this.coords.x2 - this.coords.x1);
        var height = Math.abs(this.coords.y2 - this.coords.y1);
        var x = Math.min(this.coords.x1, this.coords.x2);
        var y = Math.min(this.coords.y1, this.coords.y2);
        this.selection.style.left = x+"px";
        this.selection.style.top = y+"px";
        this.selection.style.width = width+"px";
        this.selection.style.height = height+"px";
        body.appendChild(this.selection);
    },
    prepareCrop: function(image) {
        var that = this;
        this.image = image;
        this.drawImage(image);
        this.addCropMenu();
        this.can_upload = false;
        var img = document.getElementsByTagName("img")[0];
        img.onmousedown = function(ev) {
            that.coords.x1 = ev.clientX;
            that.coords.y1 = ev.clientY;
            img.onmousemove = function (ev) {
                that.coords.x2 = ev.clientX;
                that.coords.y2 = ev.clientY;
                that.drawSelection();
            }
            return false;
        }
        img.onmouseup = function (ev) {
            img.onmousemove = null;
        }
    },
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
            if(that.can_upload) {
                that.regio.focus()
            }
        });
    },
    paste: function (ev) {
        var that = this;
        var data = ev.clipboardData || window.clipboardData;
        if (data.items) {
            if (data.items[0] && data.items[0].type.indexOf("image/") !== -1) {
                var image = data.items[0].getAsFile();
                if (image) {
                    this.prepareCrop(image);
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
            this.prepareCrop(blob);
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
        this.coords = {};
        this.can_upload = true;
        this.progress = document.getElementById("progress");
        this.form = document.getElementById("file_form");
        if(this.form){
            this.form.onsubmit = function(ev) {
                ev.preventDefault();
                that.prepareCrop();
            }
        }
        document.addEventListener('paste', function (ev) {
            that.paste(ev);
        });
        this.addPasteRegio();
    }
};