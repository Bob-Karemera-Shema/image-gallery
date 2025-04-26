export interface Image {
    id: string;
    caption: string;
    thumbUrl: string;
    fullUrl: string;
}

export interface FetchedImage {
    id: string;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
}