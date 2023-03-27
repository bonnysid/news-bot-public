import axios from "axios";
import { JSDOM } from "jsdom";
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

const replacer = (text: string) => {
    return text.replace(/<[^<>]+>/gm, '');
}
export const parseUrl = async ({
    url,
    descriptionSelector,
    titleSelector,
    hrefSelector,
    cardSelector,
    hrefBaseUrl = '',
    containerSelector,
}: ParserProps): Promise<INews[]> => {
    try {
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            }
        });


        if (res.data) {
            const dom = new JSDOM(res.data);
            const doc = dom.window.document;
            const container = containerSelector ? doc.querySelector(containerSelector) || doc : doc;
            const news = Array.from(container.querySelectorAll<HTMLLinkElement>(cardSelector))
                .map(el => {
                    const hrefEl = el.querySelector<HTMLLinkElement>(hrefSelector) || el;
                    const titleEl = el.querySelector<HTMLHeadElement>(titleSelector);
                    const descriptionEl = descriptionSelector ? el.querySelector<HTMLHeadElement>(descriptionSelector) : undefined;
                    return {
                        title: replacer(titleEl?.innerHTML || ''),
                        description: replacer(descriptionEl?.innerHTML || ''),
                        href: `${hrefBaseUrl}${hrefEl?.href}`,
                    }
                }).filter(it => Boolean(it.title));
            return news;
        }

        return [];
    } catch (e) {
        return [];
    }
}
