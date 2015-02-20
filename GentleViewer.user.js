// ==UserScript==
// @name         Gentle Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.1
// @description  Auto load hentai pic.
// @icon         http://e-hentai.org/favicon.ico
// @author       KNowlet
// @match        http://*hentai.org/g/*
// @include      http://*hentai.org/g/*
// @grant        none
// ==/UserScript==
(function() {
    var Gallery = function(szName, nAge) {
        this.pageNum = document.querySelectorAll("td[onclick^=sp]").length / 2
        this.imgNum = parseInt(gdd.querySelectorAll("td.gdt2")[1].innerText.split(" ")[0])
    };

    Gallery.prototype = {
        imgList: [],
        loadPageUrls: function(element) {
            [].forEach.call(element.querySelectorAll("a[href]"), function(item) {
                var ajax = new XMLHttpRequest
                ajax.onreadystatechange = function() {
                    if (4 == ajax.readyState && 200 == ajax.status) {
                        var imgNo = parseInt(ajax.responseText.match("startpage=(\\d)").pop())
                        var src = (new DOMParser).parseFromString(ajax.responseText, "text/html").getElementById("img").src
                        Gallery.prototype.imgList[imgNo-1].src = src
                        delete this
                    }
                }
                ajax.open("GET", item.href)
                ajax.send(null)
            })
        },
        getNextPage: function() {
            var LoadPageUrls = this.loadPageUrls
            for (var i = 1; i < this.pageNum; ++i) {
                var ajax = new XMLHttpRequest
                ajax.onreadystatechange = function() {
                    if (4 == ajax.readyState && 200 == ajax.status) {
                        var dom = (new DOMParser).parseFromString(ajax.responseText, "text/html")
                        LoadPageUrls(dom.getElementById("gdt"))
                        delete this
                    }
                }
                ajax.open("GET", base_url + "g/" + gid + "/" + token + "/?p=" + i)
                ajax.send(null)
            }
        },
        claenGDT: function() {
            while (gdt.firstChild.className)
                gdt.removeChild(gdt.firstChild)
        },
        generateImg: function() {
            for (var i = 0; i < this.imgNum; ++i) {
                var img = document.createElement("img")
                img.setAttribute("src", "//ehgt.org/g/roller.gif")
                this.imgList.push(img)
                gdt.appendChild(img)
            }
        }
    };
    var g = new Gallery
    g.generateImg()
    g.loadPageUrls(gdt)
    g.claenGDT()
    if (g.pageNum)
        g.getNextPage()
})();