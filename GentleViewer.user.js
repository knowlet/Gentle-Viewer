// ==UserScript==
// @name         Gentle Viewer
// @namespace    http://knowlet3389.blogspot.tw/
// @version      1.2
// @description  Auto load hentai pic.
// @icon         http://e-hentai.org/favicon.ico
// @author       KNowlet
// @include      /^http[s]?:\/\/e-hentai.org\/g\/.*$/
// @include      /^http[s]?:\/\/exhentai.org\/g\/.*$/
// @grant        none
// @downloadURL  https://github.com/knowlet/Gentle-Viewer/raw/dev/GentleViewer.user.js
// ==/UserScript==
'use strict';
// Simple configuration object
const CONFIG = {
    SCROLL_THRESHOLD: 0.8,
    PAGE_DELAY: 2000,
    LOADING_GIF: '//ehgt.org/g/roller.gif'
};

class GentleViewer {
    constructor(pageNum = 0, imgNum = 0) {
        this.pageNum = pageNum;
        this.imgNum = imgNum;
        this.imgList = [];

        if (this.isValid()) {
            this.preCheck();
            this.initialize();
        } else {
            window.alert("Invalid configuration. Please report this issue on Github.");
            window.open("https://github.com/knowlet/Gentle-Viewer/issues");
        }
    }

    isValid() {
        return (this.imgNum > 41 && this.pageNum < 2) || this.imgNum !== 0;
    }

    preCheck() {
        if (window.gnd !== undefined) {
            if (confirm("There are newer versions of this gallery available, goto the newest gallery?")) {
                location.assign(document.querySelector("#gnd > a:nth-last-child(2)").href);
            }
        }
    }

    async initialize() {
        try {
            // Gather URLs before cleaning
            const initialUrls = Array.from(
                window.gdt.querySelectorAll('a[href]'),
                link => link.href
            );

            // Clean and setup
            this.cleanGallery();
            await this.setupImages();
            await this.loadUrls(initialUrls);

            // Start next page loading if needed
            if (this.pageNum) {
                this.getNextPage(1);
            }
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    cleanGallery() {
        while (window.gdt.firstChild) {
            window.gdt.removeChild(window.gdt.firstChild);
        }
        // remove grid display class
        window.gdt.className = "";
        window.gdt.style = "display: block;";
        
    }

    async setupImages() {
        for (let i = 0; i < this.imgNum; i++) {
            const img = new Image();
            img.src = CONFIG.LOADING_GIF;
            this.imgList.push(img);
            window.gdt.appendChild(img);
        }
    }

    async loadUrls(urls) {
        const fetchPromises = urls.map(url =>
            fetch(url, { credentials: 'include' })
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const imgNo = Number(html.match(/startpage=(\d+)/)?.[1] || 0);
                    const imgSrc = doc.getElementById('img')?.src;

                    if (imgNo && imgSrc && this.imgList[imgNo - 1]) {
                        this.imgList[imgNo - 1].src = imgSrc;
                    }
                })
                .catch(error => console.error(`Failed to load image from ${url}:`, error))
        );

        await Promise.all(fetchPromises);
    }

    async loadPage(pageNum) {
        try {
            const response = await fetch(`${location.href}?p=${pageNum}`, {
                credentials: 'include'
            });
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            const gallery = doc.getElementById('gdt');
            if (gallery) {
                const urls = Array.from(
                    gallery.querySelectorAll('a[href]'),
                    link => link.href
                );
                await this.loadUrls(urls);
            }

            if (pageNum < this.pageNum) {
                setTimeout(() => this.getNextPage(pageNum + 1), CONFIG.PAGE_DELAY);
            }
        } catch (error) {
            console.error(`Failed to load page ${pageNum}:`, error);
        }
    }

    getNextPage(pageNum) {
        const checkScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            return scrollTop >= (scrollHeight - clientHeight) * CONFIG.SCROLL_THRESHOLD;
        };

        if (checkScroll()) {
            this.loadPage(pageNum);
            return;
        }

        const scrollHandler = () => {
            if (checkScroll()) {
                window.removeEventListener('scroll', scrollHandler);
                this.loadPage(pageNum);
            }
        };

        window.addEventListener('scroll', scrollHandler);
    }
}

// Initialize the viewer
try {
    const pageNumElement = [...document.querySelectorAll('table.ptt td')].slice(-2)[0];
    const imageCountElement = window.gdd.querySelector('#gdd tr:nth-child(n+6) td.gdt2');

    if (pageNumElement && imageCountElement) {
        const pageNum = Number(pageNumElement.textContent);
        const imgNum = Number(imageCountElement.textContent.split(' ')[0]);
        new GentleViewer(pageNum, imgNum);
    } else {
        throw new Error('Required elements not found');
    }
} catch (error) {
    console.error('Failed to initialize viewer:', error);
    window.alert('Failed to initialize. Please check the console for details.');
}
