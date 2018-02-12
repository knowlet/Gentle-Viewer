// ==UserScript==
// @name         Gentle Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.5
// @description  Auto load hentai pic.
// @icon         http://e-hentai.org/favicon.ico
// @author       KNowlet
// @include      /^http[s]?:\/\/e-hentai.org\/g\/.*$/
// @include      /^http[s]?:\/\/exhentai.org\/g\/.*$/
// @grant        none
// @downloadURL  https://github.com/knowlet/Gentle-Viewer/raw/master/GentleViewer.user.js
// ==/UserScript==
(function(lpPage, lpImg) {
    var Gallery = function(pageNum, imgNum) {
        this.pageNum = pageNum || 0;
        this.imgNum = imgNum || 0;
    };

    Gallery.prototype = {
        imgList: [],
        checkFunctional: function() {
            return (this.imgNum > 41 && this.pageNum < 2) || this.imgNum !== 0;
        },
        loadPageUrls: function(element) {
            [].forEach.call(element.querySelectorAll("a[href]"), function(item) {
                var ajax = new XMLHttpRequest();
                ajax.onreadystatechange = function() {
                    if (4 == ajax.readyState && 200 == ajax.status) {
                        var imgNo = parseInt(ajax.responseText.match("startpage=(\\d+)").pop());
                        var src = (new DOMParser()).parseFromString(ajax.responseText, "text/html").getElementById("img").src;
                        Gallery.prototype.imgList[imgNo-1].src = src;
                    }
                };
                ajax.open("GET", item.href);
                ajax.send(null);
            });
        },
        getNextPage: function() {
            var LoadPageUrls = this.loadPageUrls;
            var ajax = new XMLHttpRequest();
            ajax.onreadystatechange = function() {
                if (4 == this.readyState && 200 == this.status) {
                    var dom = (new DOMParser()).parseFromString(this.responseText, "text/html");
                    LoadPageUrls(dom.getElementById("gdt"));
                }
            };
            for (var i = 1; i < this.pageNum; ++i) {
                ajax.open("GET", location.href + "?p=" + i);
                ajax.send(null);
            }
        },
        claenGDT: function() {
            while (gdt.firstChild && gdt.firstChild.className)
                gdt.removeChild(gdt.firstChild);
        },
        generateImg: function(callback) {
            for (var i = 0; i < this.imgNum; ++i) {
                var img = document.createElement("img");
                img.setAttribute("src", "http://ehgt.org/g/roller.gif");
                this.imgList.push(img);
                gdt.appendChild(img);
            }
            callback();
        }
    };
    var g = new Gallery(lpPage, lpImg);
    if (g.checkFunctional()) {
        g.generateImg(function() {
            g.loadPageUrls(gdt);
            g.claenGDT();
            if (g.pageNum)
                g.getNextPage();
        });
    }
    else {
        alert("There are some issue in the script\nplease open an issue on Github");
        window.open("https://github.com/knowlet/Gentle-Viewer/issues");
    }
})(document.querySelectorAll("table.ptt td").length - 2, parseInt(gdd.querySelector("#gdd tr:nth-child(n+6) td.gdt2").textContent.split(" ")[0]));
