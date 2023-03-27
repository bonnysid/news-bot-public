"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const news_1 = require("./news");
const token = '6267147617:AAHkAWZ0DGvW1aoL_aeHvcf79Ozi8FJhqSs';
const bot = new node_telegram_bot_api_1.default(token, {
    polling: true,
});
var Commands;
(function (Commands) {
    Commands["INFO"] = "/info";
    Commands["START"] = "/start";
})(Commands || (Commands = {}));
bot.setMyCommands([
    { command: Commands.INFO, description: 'Поиск' },
]);
const STEP = 5;
const chatSettings = {};
const savedNews = {};
const nextOptions = {
    inline_keyboard: [
        [{ text: 'Следующие 5 новостей', callback_data: 'next' }]
    ]
};
const createTitle = ({ title, href, text }) => {
    if (title) {
        return href ? `<a href="${href}"><b>${title}</b></a>` : `<b>${title}</b>`;
    }
    if (text) {
        return href ? `<a href="${href}">${text}</a>` : `${text}`;
    }
    return '';
};
const createSendMessage = (chatId) => {
    const sendMessage = async ({ sticker, image, description, reply, ...titleProps }) => {
        const msg = `${createTitle(titleProps)}\n${description || ''}`;
        if (sticker) {
            await bot.sendSticker(chatId, sticker);
        }
        await bot.sendMessage(chatId, msg, {
            parse_mode: 'HTML',
            reply_markup: reply,
        });
        if (image) {
            await bot.sendSticker(chatId, image);
        }
    };
    return {
        sendNews: async (news, showReply) => {
            for (let i = 0; i < news.length; i++) {
                const card = news[i];
                if (card.title) {
                    await sendMessage({
                        title: card.title,
                        description: card.description,
                        href: card.href,
                        reply: showReply && (i === news.length - 1) ? nextOptions : undefined,
                    });
                }
            }
        },
        sendMessage,
    };
};
bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    let settings = chatSettings[chatId];
    const { sendMessage, sendNews } = createSendMessage(chatId);
    if (!settings) {
        chatSettings[chatId] = { currentPage: 0, totalPages: 0, sendedPages: 0, savedNews: [] };
        settings = chatSettings[chatId];
    }
    switch (text) {
        case Commands.START:
            sendMessage({
                text: 'Привет, я новостной бот!',
                sticker: 'https://cdn.tlgrm.app/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/192/1.webp',
            });
            break;
        case Commands.INFO:
            settings.sendedPages = 0;
            settings.currentPage = 0;
            settings.totalPages = 0;
            sendMessage({
                text: `Напишите то что должно содержаться в заголовке новости, а я попробую найти все что с ней связано!`,
            });
            break;
    }
    if (chatSettings[chatId].prevCommand === Commands.INFO && text !== Commands.INFO) {
        const currentPage = settings.currentPage;
        sendMessage({ text: 'Ищу...' });
        let allNews = [];
        const handleResponse = (res) => {
            allNews = [...allNews, ...res];
            savedNews[text || ''] = allNews;
            settings.totalPages = Math.ceil(allNews.length / STEP);
            if (settings.sendedPages !== (currentPage + 1) * STEP) {
                const msgs = allNews.slice(currentPage, (currentPage + 1) * STEP);
                settings.sendedPages = msgs.length;
                sendNews(msgs, settings.totalPages > (currentPage + 1));
            }
        };
        const oldNews = savedNews[text || ''];
        if (oldNews) {
            handleResponse(oldNews);
        }
        else {
            (0, news_1.getRiaNews)(text).then(handleResponse);
            (0, news_1.getSecLabNews)(text).then(handleResponse);
        }
        setTimeout(() => {
            delete savedNews[text || ''];
        }, 15 * 60 * 1000);
    }
    settings.prevCommand = text;
});
bot.on('callback_query', async (msg) => {
    const data = msg.data || '';
    const chatId = msg.message?.chat?.id;
    if (chatId && data === 'next') {
        const { sendNews } = createSendMessage(chatId);
        const settings = chatSettings[chatId];
        settings.currentPage = settings.currentPage + 1;
        const allNews = savedNews[settings.prevCommand || ''];
        const currentPage = settings.currentPage;
        if (settings.sendedPages !== (currentPage + 1) * STEP && allNews) {
            const msgs = allNews.slice(currentPage * STEP, (currentPage + 1) * STEP);
            settings.sendedPages = settings.sendedPages + msgs.length;
            sendNews(msgs, settings.totalPages > (currentPage + 1));
        }
    }
});
//# sourceMappingURL=index.js.map