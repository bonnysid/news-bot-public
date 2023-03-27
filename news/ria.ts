import {parseUrl} from "./base";

export const getRiaNews = async (search: string = '') => {
    return await parseUrl({
        url: `https://ria.ru/search/?query=${search}`,
        hrefSelector: '.list-item__title',
        titleSelector: '.list-item__title',
        cardSelector: '.list-item',
    })
}
