"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRiaNews = void 0;
const base_1 = require("./base");
const getRiaNews = async (search = '') => {
    return await (0, base_1.parseUrl)({
        url: `https://ria.ru/search/?query=${search}`,
        hrefSelector: '.list-item__title',
        titleSelector: '.list-item__title',
        cardSelector: '.list-item',
    });
};
exports.getRiaNews = getRiaNews;
//# sourceMappingURL=ria.js.map