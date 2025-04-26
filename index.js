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
let currentImageIndex;
function fetchImages() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch('https://picsum.photos/v2/list');
        const data = yield response.json();
        imageArray.push(...data.slice(0, 20));
        displayThumbnails();
    });
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
    });
}
function openImageHandler(e) {
    const target = e.target.parentElement;
    const index = parseInt(target.id);
    currentImageIndex = index;
    fullImageEl.setAttribute('src', imageArray[index].download_url);
    authorEl.textContent = imageArray[index].author;
    downloadEl.setAttribute('href', imageArray[index].download_url);
    bodyEl.classList.add('no-scroll');
    lightboxContainerEl.classList.add('open-lightbox-container');
}
function lightboxClickHandler(e) {
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
    if (elementId === 'prev') {
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
export {};
