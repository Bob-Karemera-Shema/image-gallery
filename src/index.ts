const bodyEl = document.querySelector('body') as HTMLBodyElement;
const imageGridEl = document.querySelector('.image-grid') as HTMLDivElement;
const lightboxContainerEl = document.querySelector('.lightbox-container') as HTMLDivElement;
const fullImageEl = document.querySelector('.full-image') as HTMLImageElement;
const authorEl = document.querySelector('.author') as HTMLSpanElement;
const downloadEl = document.querySelector('.download-link') as HTMLAnchorElement;

import { Image } from "./interfaces";

const imageArray: Image[] = [];
let currentImageIndex: number;

async function fetchImages(): Promise<void> {
    const response = await fetch('https://picsum.photos/v2/list');
    const data: Image[] = await response.json();
    imageArray.push(...data.slice(0, 20));
    displayThumbnails();
}

function displayThumbnails() {
    imageArray.forEach((image, index) => {
        const tileEl = document.createElement('div');
        tileEl.classList.add('tile');
        tileEl.setAttribute('id', image.id.toString());

        const imageEl = document.createElement('img');
        imageEl.classList.add('thumbnail');
        imageEl.setAttribute('src', image.download_url);

        const overlayEl = document.createElement('span');
        overlayEl.classList.add('overlay');

        tileEl.appendChild(imageEl);
        tileEl.appendChild(overlayEl);

        imageGridEl.appendChild(tileEl);
    })
}

function openImageHandler(e: Event) {
    const target = e.target.parentElement as HTMLElement;
    const index = parseInt(target.id);
    currentImageIndex = index;

    fullImageEl.setAttribute('src', imageArray[index].download_url);
    authorEl.textContent = imageArray[index].author;
    downloadEl.setAttribute('href', imageArray[index].download_url);

    bodyEl.classList.add('no-scroll');
    lightboxContainerEl.classList.add('open-lightbox-container');
}

function lightboxClickHandler(e: Event) {
    const elementId = e.target.id;

    if (elementId === 'close') {
        bodyEl.classList.remove('no-scroll');
        lightboxContainerEl.classList.remove('open-lightbox-container');
        return;
    }

    if (elementId === 'next') {
        currentImageIndex = currentImageIndex === imageArray.length - 1 ? 0 : currentImageIndex + 1;
        fullImageEl.setAttribute('src', imageArray[currentImageIndex].download_url);
        authorEl.textContent = imageArray[currentImageIndex].author;
        downloadEl.setAttribute('href', imageArray[currentImageIndex].download_url);
        return;
    }

    if(elementId === 'prev') {
        currentImageIndex = currentImageIndex === 0 ? imageArray.length - 1 : currentImageIndex - 1;
        fullImageEl.setAttribute('src', imageArray[currentImageIndex].download_url);
        authorEl.textContent = imageArray[currentImageIndex].author;
        downloadEl.setAttribute('href', imageArray[currentImageIndex].download_url);
        return;
    }
}

imageGridEl.addEventListener('click', openImageHandler);

lightboxContainerEl.addEventListener('click', lightboxClickHandler);

fetchImages();