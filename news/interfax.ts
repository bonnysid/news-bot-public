import { parseUrl } from './base';

export const getInterfaxNews = async (search = '') => {
  return await parseUrl({
    url: `https://www.interfax.ru/search/?phrase=${search}`,
    containerSelector: '.sPageResult',
    cardSelector: '.sPageResult > div > div',
    titleSelector: 'a:last-child',
    hrefBaseUrl: 'https://www.interfax.ru/',
    hrefSelector: 'a:last-child'
  })
}
