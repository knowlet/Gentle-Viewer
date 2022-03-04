// ==UserScript==
// @name         Gentle Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      0.45
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
                this.loadPageUrls(window.gdt);
                this.cleanGDT();
                if (this.pageNum) {
                    setTimeout(_ => { this.getNextPage(1); }, 10000);
                }
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
    getPage(p) {
        fetch(`${location.href}?p=${p}`, {credentials: 'include'})
            .then(res => res.text())
            .then(html => {
            let dom = (new DOMParser()).parseFromString(html, 'text/html');
            this.loadPageUrls(dom.getElementById('gdt'));
        });
        if (p < this.pageNum) {
            setTimeout(_ => { this.getNextPage(p + 1); }, 2000);
        }
    }
    getNextPage(i) {
        const myInterval = setInterval(_ => {
            if (document.documentElement.scrollTop >= (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 0.8) {
                clearTimeout(myTimeout);
                clearInterval(myInterval);
                this.getPage(i);
            }
        }, 1000);
        const myTimeout = setTimeout(_ => {
            clearInterval(myInterval);
            this.getPage(i);
        }, 30000);
    }
    cleanGDT() {
        while (window.gdt.firstChild && window.gdt.firstChild.className) {
            window.gdt.removeChild(window.gdt.firstChild);
        }
    }
    generateImg(callback) {
        for (let i = 0; i < this.imgNum; ++i) {
            let img = new Image();
            img.src = 'http://ehgt.org/g/roller.gif';
            this.imgList.push(img);
            window.gdt.appendChild(img);
        }
        callback && callback();
    }
}
new Gentle(Number([...document.querySelectorAll("table.ptt td")].slice(-2)[0].textContent), Number(window.gdd.querySelector("#gdd tr:nth-child(n+6) td.gdt2").textContent.split(" ")[0]));
