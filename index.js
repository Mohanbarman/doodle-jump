const root = document.querySelector('.root');

const ROOT_HEIGHT = 900;
const ROOT_WIDTH = 500;
const DOODLER_HEIGHT = 100;
const DOODLER_WIDTH = 70;
const PLATFORM_HEIGHT = 20;
const PLATFORM_WIDTH = 150;

let isGameOver = false;
let platformCount = 5;
let platforms = [];
let doodler;


class Platform {
    constructor(platformBottom) {
        this.bottom = platformBottom;
        this.left = Math.random() * (ROOT_WIDTH - PLATFORM_WIDTH);
        this.htmlElement = document.createElement('div');

        const htmlElement = this.htmlElement;
        root.appendChild(htmlElement);
        htmlElement.classList.add('platform');
        htmlElement.style.left = this.left + 'px';
        htmlElement.style.bottom = this.bottom + 'px';
    }

    shiftBottom(offset) {
        this.bottom -= offset;
        this.htmlElement.style.bottom = this.bottom + 'px';
    }

    destroy() {
        const element = this.htmlElement;
        element.remove();
    }
}

class Doodler {
    constructor(firstPlatform) {
        this.bottom = firstPlatform.bottom + PLATFORM_HEIGHT + DOODLER_HEIGHT;
        this.left = firstPlatform.left + PLATFORM_WIDTH / 2 - DOODLER_WIDTH / 2;
        this.htmlElement = document.createElement('div');

        const htmlElement = this.htmlElement;
        htmlElement.classList.add('doodler');
        htmlElement.style.left = this.left + 'px';
        htmlElement.style.bottom = this.bottom + 'px';
        root.appendChild(htmlElement);
    }

    jump() {
        if (this.fallInterval) clearInterval(this.fallInterval);
        this.jumpInterval = setInterval(() => {
            this.shiftBottom(-5);
        }, 30)
    }

    shiftLeft(offset) {
        this.left += offset;
        this.htmlElement.style.left = this.left + 'px';
    }

    fall() {
        if (this.jumpInterval) clearInterval(this.jumpInterval);
        this.fallInterval = setInterval(() => {
            this.shiftBottom(5);
            // Let's clear the interval if our doodler reaches bottom
            if (this.bottom <= 0) {
                clearInterval(this.fallInterval);
            }
            // Check if doodle falls down to any platform
            if (platforms.some((i) => i.bottom + PLATFORM_HEIGHT === this.bottom)) {
                clearInterval(this.fallInterval);
            };
        }, 30);
    }

    shiftBottom(offset) {
        this.bottom -= offset;
        this.htmlElement.style.bottom = this.bottom + 'px';
    }

    destroy() {
        const element = this.htmlElement;
        element.remove();
    }

    clearIntervals() {
        if (this.jumpInterval) clearInterval(this.jumpInterval);
        if (this.fallInterval) clearInterval(this.fallInterval);
    }
}

function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
        let platformGap = ROOT_HEIGHT / platformCount;
        let platformBottom = 100 + platformGap * i;
        let platform = new Platform(platformBottom);
        platforms.push(platform);
    }
}

function movePlatforms() {
    if (doodler.bottom > ROOT_HEIGHT / 2) {
        platforms.forEach((i) => {
            i.shiftBottom(1);
            if (i.bottom + PLATFORM_HEIGHT <= 0) {
                i.destroy();
                let platform = new Platform(ROOT_HEIGHT + PLATFORM_HEIGHT);
                platforms.shift();
                platforms.push(platform);
            }
        })
    }
}

function initializeControls() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') {
            doodler.jump();
        } else if (event.key === 'ArrowLeft') {
            doodler.shiftLeft(-5);
        } else if (event.key === 'ArrowRight') {
            doodler.shiftLeft(5);
        }
    })
}


function start() {
    if (!isGameOver) {
        createPlatforms();
        doodler = new Doodler(platforms[0]);
        setInterval(movePlatforms, 30);
        doodler.fall();
        initializeControls();
    }
}

start();