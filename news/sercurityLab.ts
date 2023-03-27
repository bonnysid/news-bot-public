import {parseUrl} from "./base";

export const getSecLabNews = async (search?: string) => {
    return (await parseUrl({
        url: 'https://www.securitylab.ru/news/',
        descriptionSelector: 'p',
        cardSelector: '.article-card',
        titleSelector: '.article-card-title',
        hrefSelector: '.article-card',
        hrefBaseUrl: 'https://www.securitylab.ru/',
    })).filter(card => card.title?.toLowerCase().includes(search?.toLowerCase() || ''));
}
