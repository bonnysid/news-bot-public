"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecLabNews = void 0;
const base_1 = require("./base");
const getSecLabNews = async (search) => {
    return (await (0, base_1.parseUrl)({
        url: 'https://www.securitylab.ru/news/',
        descriptionSelector: 'p',
        cardSelector: '.article-card',
        titleSelector: '.article-card-title',
        hrefSelector: '.article-card',
        hrefBaseUrl: 'https://www.securitylab.ru/',
    })).filter(card => card.title?.toLowerCase().includes(search?.toLowerCase() || ''));
};
exports.getSecLabNews = getSecLabNews;
//# sourceMappingURL=sercurityLab.js.map