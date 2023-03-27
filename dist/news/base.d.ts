import { INews } from './types';
interface ParserProps {
    url: string;
    cardSelector: string;
    titleSelector: string;
    descriptionSelector?: string;
    hrefSelector: string;
    hrefBaseUrl?: string;
    containerSelector?: string;
}
export declare const parseUrl: ({ url, descriptionSelector, titleSelector, hrefSelector, cardSelector, hrefBaseUrl, containerSelector, }: ParserProps) => Promise<INews[]>;
export {};
