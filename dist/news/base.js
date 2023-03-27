"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = void 0;
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = require("jsdom");
const replacer = (text) => {
    return text.replace(/<[^<>]+>/gm, '');
};
const parseUrl = async ({ url, descriptionSelector, titleSelector, hrefSelector, cardSelector, hrefBaseUrl = '', containerSelector, }) => {
    try {
        const res = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
            }
        });
        if (res.data) {
            const dom = new jsdom_1.JSDOM(res.data);
            const doc = dom.window.document;
            const container = containerSelector ? doc.querySelector(containerSelector) || doc : doc;
            const news = Array.from(container.querySelectorAll(cardSelector))
                .map(el => {
                const hrefEl = el.querySelector(hrefSelector) || el;
                const titleEl = el.querySelector(titleSelector);
                const descriptionEl = descriptionSelector ? el.querySelector(descriptionSelector) : undefined;
                return {
                    title: replacer(titleEl?.innerHTML || ''),
                    description: replacer(descriptionEl?.innerHTML || ''),
                    href: `${hrefBaseUrl}${hrefEl?.href}`,
                };
            }).filter(it => Boolean(it.title));
            return news;
        }
        return [];
    }
    catch (e) {
        return [];
    }
};
exports.parseUrl = parseUrl;
//# sourceMappingURL=base.js.map