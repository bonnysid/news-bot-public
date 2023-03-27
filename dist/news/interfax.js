"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterfaxNews = void 0;
const base_1 = require("./base");
const getInterfaxNews = async (search = '') => {
    return await (0, base_1.parseUrl)({
        url: `https://www.interfax.ru/search/?phrase=${search}`,
        containerSelector: '.sPageResult',
        cardSelector: '.sPageResult > div > div',
        titleSelector: 'a:last-child',
        hrefBaseUrl: 'https://www.interfax.ru/',
        hrefSelector: 'a:last-child'
    });
};
exports.getInterfaxNews = getInterfaxNews;
//# sourceMappingURL=interfax.js.map