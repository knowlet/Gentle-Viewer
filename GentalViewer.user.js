// ==UserScript==
// @name            Gental Viewer
// @version         1.4
// @author          knowlet
// @namespace       http://knowlet3389.blogspot.tw/
// @description     Auto load henati pic.
// @match           http://g.e-hentai.org/g/*
// @match           http://exhentai.org/g/*
// @include         http://g.e-hentai.org/g/*
// @include         http://exhentai.org/g/*
// ==/UserScript==
(function() {
    var d = document.createElement("script");
    d.setAttribute("type", "application/javascript");
    d.textContent = "(" + function() {
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
    } + ")();";
    document.body.appendChild(d);
})();