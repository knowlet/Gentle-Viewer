// ==UserScript==
// @name         Gental Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.1
// @description  Auto load hentai pic.
// @icon         http://e-hentai.org/favicon.ico
// @author       KNowlet
// @match        http://hentai.org/g/*
// @include      http://*hentai.org/g/*
// @grant        none
// ==/UserScript==
(function() {
    function d(b) {
        c.onreadystatechange = function() {
            if (4 == c.readyState && 200 == c.status)
                f.appendChild((new DOMParser).parseFromString(c.responseText, "text/html").getElementsByTagName("img")[4]);
        };
        for (var a = 0; a < b.length; ++a)
            c.open("GET", b[a].href, !1), c.send();
    }
    var g = document.getElementsByTagName("td"), e = 0, b, c = new XMLHttpRequest, f = document.body.cloneNode(!1);
    for (b in g)
        null != g[b].onclick && ++e;
    d(gdt.getElementsByTagName("a"));
    document.documentElement.replaceChild(f, document.body);
    if (e / 2) {
        var a = new XMLHttpRequest;
        a.onreadystatechange = function() {
            4 == a.readyState && 200 == a.status && d((new DOMParser).parseFromString(a.responseText, "text/html").getElementById("gdt").getElementsByTagName("a"));
        };
        for (b = 1; b < e / 2; ++b)
            a.open("GET", base_url + "g/" + gid + "/" + token + "/?p=" + b, !1), a.send();
    }
})();