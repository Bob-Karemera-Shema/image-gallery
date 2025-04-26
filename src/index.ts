import { Image, FetchedImage } from "./interfaces";

const bodyEl = document.querySelector('body') as HTMLBodyElement;
const imageGridEl = document.querySelector('.image-grid') as HTMLDivElement;
const lightboxContainerEl = document.querySelector('.lightbox-container') as HTMLDivElement;
const fullImageEl = document.querySelector('.full-image') as HTMLImageElement;
const authorEl = document.querySelector('.author') as HTMLSpanElement;
const downloadEl = document.querySelector('.download-link') as HTMLAnchorElement;

const imageArray: Image[] = [];
let currentImageIndex = 0;

async function fetchImages(): Promise<void> {
    try {
        const response = await fetch('https://picsum.photos/v2/list');

        if (!response.ok) throw new Error("Failed to fetch images");

        const data: FetchedImage[] = await response.json();

        data.slice(0, 20).forEach(image => {
            imageArray.push({
                id: image.id,
                caption: `Photo by ${image.author}`,
                thumbUrl: `https://picsum.photos/id/${image.id}/300/200`,
                fullUrl: `https://picsum.photos/id/${image.id}/800/540`,
            })
        })

        displayThumbnails();
    } catch (error) {
        console.error("Image fetch error:", error);
        alert(`Image fetch error: ${error}`);
    }
}

function updateLightboxImage(index: number) {
    const image = imageArray[index];
    if(!image) return;

    fullImageEl.src = image.fullUrl;
    authorEl.textContent = image.caption;
    downloadEl.href = image.fullUrl;
}

function openFullImage(index: number) {
    currentImageIndex = index;
    updateLightboxImage(index);
    bodyEl.classList.add('no-scroll');
    lightboxContainerEl.classList.add('open-lightbox-container');
}

function closeFullImage() {
    bodyEl.classList.remove('no-scroll');
    lightboxContainerEl.classList.remove('open-lightbox-container');
}

function nextFullImage() {
    if(currentImageIndex === imageArray.length - 1) return;
    currentImageIndex += 1;
    updateLightboxImage(currentImageIndex);
}

function prevFullImage() {
    if(currentImageIndex === 0) return;
    currentImageIndex -= 1;
    updateLightboxImage(currentImageIndex);
}

function displayThumbnails() {
    const fragment = document.createDocumentFragment();

    imageArray.forEach((image, index) => {
        const tileEl = document.createElement('div');
        tileEl.classList.add('tile');
        tileEl.setAttribute('data-index', index.toString());

        const imageEl = document.createElement('img');
        imageEl.classList.add('thumbnail');
        imageEl.setAttribute('src', image.thumbUrl);
        imageEl.setAttribute('alt', image.caption);

        const overlayEl = document.createElement('span');
        overlayEl.classList.add('overlay');

        tileEl.appendChild(imageEl);
        tileEl.appendChild(overlayEl);

        fragment.appendChild(tileEl);
    });

    imageGridEl.appendChild(fragment);
}

function openImageHandler(e: MouseEvent) {
    const tile = (e.target as HTMLElement).closest('.tile') as HTMLElement;
    if (!tile) return;

    const index = parseInt(tile.dataset.index ? tile.dataset.index : '');
    if(!isNaN(index)) openFullImage(index);
}

function lightboxClickHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if(!target.classList.contains('button')) return;

    e.stopPropagation(); // Prevent event handling outside the lightbox

    switch (target.id) {
        case 'close':
            closeFullImage();
            break;
        case 'next':
            nextFullImage();
            break;
        case 'prev':
            prevFullImage();
            break;
        default:
            break;
    }
}

function lightboxKeydownHandler(e: KeyboardEvent) {
    if (!lightboxContainerEl.classList.contains('open-lightbox-container')) return;

    switch (e.code) {
        case 'Escape':
            closeFullImage();
            break;
        case 'ArrowRight':
            nextFullImage();
            break;
        case 'ArrowLeft':
            prevFullImage();
            break;
    }
}

imageGridEl.addEventListener('click', openImageHandler);

lightboxContainerEl.addEventListener('click', lightboxClickHandler);

document.addEventListener('keydown', lightboxKeydownHandler);

fetchImages();