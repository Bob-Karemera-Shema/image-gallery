var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bodyEl = document.querySelector('body');
const imageGridEl = document.querySelector('.image-grid');
const lightboxContainerEl = document.querySelector('.lightbox-container');
const fullImageEl = document.querySelector('.full-image');
const authorEl = document.querySelector('.author');
const downloadEl = document.querySelector('.download-link');
const imageArray = [];
let currentImageIndex = 0;
function fetchImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://picsum.photos/v2/list');
            if (!response.ok)
                throw new Error("Failed to fetch images");
            const data = yield response.json();
            data.slice(0, 20).forEach(image => {
                imageArray.push({
                    id: image.id,
                    caption: `Photo by ${image.author}`,
                    thumbUrl: `https://picsum.photos/id/${image.id}/300/200`,
                    fullUrl: `https://picsum.photos/id/${image.id}/800/540`,
                });
            });
            displayThumbnails();
        }
        catch (error) {
            console.error("Image fetch error:", error);
            alert(`Image fetch error: ${error}`);
        }
    });
}
function updateLightboxImage(index) {
    const image = imageArray[index];
    if (!image)
        return;
    fullImageEl.src = image.fullUrl;
    authorEl.textContent = image.caption;
    downloadEl.href = image.fullUrl;
}
function openFullImage(index) {
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
    if (currentImageIndex === imageArray.length - 1)
        return;
    currentImageIndex += 1;
    updateLightboxImage(currentImageIndex);
}
function prevFullImage() {
    if (currentImageIndex === 0)
        return;
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
function openImageHandler(e) {
    const tile = e.target.closest('.tile');
    if (!tile)
        return;
    const index = parseInt(tile.dataset.index ? tile.dataset.index : '');
    if (!isNaN(index))
        openFullImage(index);
}
function lightboxClickHandler(e) {
    const target = e.target;
    if (!target.classList.contains('button'))
        return;
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
function lightboxKeydownHandler(e) {
    if (!lightboxContainerEl.classList.contains('open-lightbox-container'))
        return;
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
export {};
