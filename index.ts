const imageGridEl = document.querySelector('.image-grid') as HTMLDivElement;
const lightboxContainerEl = document.querySelector('.lightbox-container') as HTMLDivElement;
const imageContainerEl = document.querySelector('.full-image-container') as HTMLDivElement;
const authorEl = document.querySelector('.author') as HTMLSpanElement;
const downloadEl = document.querySelector('.download-link')as HTMLAnchorElement;

import { Image } from "./interfaces";

const imageArray: Image[] = [];

function fetchImages(): void {}