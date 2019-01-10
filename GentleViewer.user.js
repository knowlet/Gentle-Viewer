// ==UserScript==
// @name         Gentle Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.43
// @description  Auto load hentai pic.
// @icon         http://e-hentai.org/favicon.ico
// @author       KNowlet
// @include      /^http[s]?:\/\/e-hentai.org\/g\/.*$/
// @include      /^http[s]?:\/\/exhentai.org\/g\/.*$/
// @grant        none
// @downloadURL  https://github.com/knowlet/Gentle-Viewer/raw/dev/GentleViewer.user.js
// ==/UserScript==
'use strict';
class Gentle {
    constructor(pageNum = 0, imgNum = 0) {
        this.pageNum = pageNum;
        this.imgNum = imgNum;
        this.imgList = [];
        if (this.checkFunctional()) {
            this.generateImg(() => {
                this.loadPageUrls(gdt);
                this.cleanGDT();
                if (this.pageNum)
                    this.getNextPage();
            });
        }
        else {
            window.alert("There are some issue in the script\nplease open an issue on Github");
            window.open("https://github.com/knowlet/Gentle-Viewer/issues");
        }
    }
    checkFunctional() {
        return (this.imgNum > 41 && this.pageNum < 2) || this.imgNum !== 0;
    }
    loadPageUrls(e) {
        for (let item of e.querySelectorAll('a[href]')) {
            fetch(item.href, {credentials: 'include'})
            .then(res => res.text())
            .then(html => {
                let imgNo = Number(html.match("startpage=(\\d+)").pop());
                let src = (new DOMParser()).parseFromString(html, 'text/html').getElementById("img").src;
                this.imgList[imgNo-1].src = src;
            });
        }
    }
    getNextPage() {
        for (let i = 1; i < this.pageNum; ++i) {
            fetch(`${location.href}?p=${i}`, {credentials: 'include'})
            .then(res => res.text())
            .then(html => {
                let dom = (new DOMParser()).parseFromString(html, 'text/html');
                this.loadPageUrls(dom.getElementById('gdt'));
            });
        }
    }
    cleanGDT() {
        while (gdt.firstChild && gdt.firstChild.className) {
            gdt.removeChild(gdt.firstChild);
        }
    }
    generateImg(callback) {
        for (let i = 0; i < this.imgNum; ++i) {
            let img = new Image();
            img.src = 'http://ehgt.org/g/roller.gif';
            this.imgList.push(img);
            gdt.appendChild(img);
        }
        callback && callback();
    }
}
new Gentle(Number([...document.querySelectorAll("table.ptt td")].slice(-2)[0].textContent), Number(gdd.querySelector("#gdd tr:nth-child(n+6) td.gdt2").textContent.split(" ")[0]));
