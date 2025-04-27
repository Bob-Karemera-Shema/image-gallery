import { Image, FetchedImage } from "./interfaces";

const getElement = <T extends Element>(selector: string) => document.querySelector(selector) as T;

const bodyEl = getElement('body') as HTMLBodyElement;
const imageGridEl = getElement('.image-grid') as HTMLDivElement;
const lightboxContainerEl = getElement('.lightbox-container') as HTMLDivElement;
const lightboxEl = getElement('.lightbox') as HTMLDivElement;

const imageArray: Image[] = [];
let currentImageIndex = 0;

async function fetchImages(): Promise<void> {
    try {
        const response = await fetch('https://picsum.photos/v2/list');
        if (!response.ok) throw new Error("Failed to fetch images");

        const data: FetchedImage[] = await response.json();

        imageArray.push(
            ...data.slice(0, 20).map(img => ({
                id: img.id,
                caption: `Photo by ${img.author}`,
                thumbUrl: `https://picsum.photos/id/${img.id}/300/200.webp`,
                fullUrl: `https://picsum.photos/id/${img.id}/800/540.webp`,
            }))
        );

        displayThumbnails();
        populateLightbox();
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

function updateLightboxImage(index: number) {
    const prevSlide = lightboxEl.querySelector("[data-active]");
    if(prevSlide) delete (prevSlide as HTMLElement).dataset.active;

    const currentSlide = lightboxEl.children[index];
    if(currentSlide) (currentSlide as HTMLElement).dataset.active = 'active';
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
        tileEl.dataset.index = index.toString();

        const imageEl = document.createElement('img');
        imageEl.classList.add('thumbnail');
        imageEl.src = image.thumbUrl;
        imageEl.alt = image.caption;

        const overlayEl = document.createElement('span');
        overlayEl.classList.add('overlay');

        tileEl.append(imageEl, overlayEl);

        fragment.appendChild(tileEl);
    });

    imageGridEl.appendChild(fragment);
}

function populateLightbox() {
    const fragment = document.createDocumentFragment();

    imageArray.forEach(image => {
        const slideEl = document.createElement('div');
        slideEl.classList.add('slide');

        const imageContainerEl = document.createElement('div');
        imageContainerEl.classList.add('full-image-container');

        const imageEl = document.createElement('img');
        imageEl.classList.add('full-image');
        imageEl.src = image.fullUrl;
        imageEl.alt = `Full view: ${image.caption}`;

        imageContainerEl.appendChild(imageEl);

        const captionContainerEl = document.createElement('div');
        captionContainerEl.classList.add('caption-container');

        const captionEl = document.createElement('span');
        captionEl.classList.add('caption');
        captionEl.textContent = image.caption;

        const downloadEl = document.createElement('a');
        downloadEl.classList.add('download-link');
        downloadEl.textContent = 'Download';
        downloadEl.href = image.fullUrl;
        downloadEl.ariaLabel = 'Download full-size image';
        downloadEl.target = '_blank';
        downloadEl.rel = 'noopener noreferrer';

        captionContainerEl.append(captionEl, downloadEl);
        slideEl.append(imageContainerEl, captionContainerEl);
        fragment.appendChild(slideEl);
    });

    lightboxEl.appendChild(fragment);
}

function openImageHandler(e: MouseEvent) {
    const tile = (e.target as HTMLElement).closest('.tile') as HTMLElement;
    if (!tile || !tile.dataset.index) return;

    const index = parseInt(tile.dataset.index);
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