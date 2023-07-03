const TelegramApi = require('node-telegram-bot-api');

const {gameOptions, againOptions} = require('./options')

const token = '5822187102:AAHxAP4N4QUhG3Bu3ME5ivdN0sdPO5GXj-Q';

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Давай пограємось!) Зараз я загадаю цифру від 0 до 9, а ти відгадай)')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Відгадай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Привітання'},
        {command: '/info', description: 'Привітання користувача'},
        {command: '/game', description: 'Граємо в гру'},
    ]);
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://stickerswiki.ams3.cdn.digitaloceanspaces.com/kotikinu/429292.160.gif')
            return bot.sendMessage(chatId, `Ласкаво просимо до боту Мілани Варди`);
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name}, привіт!`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебе не розумію. Введи правильні данні!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Вітаю ти вгадав(ла) цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Бот загадав цифру ${chats[chatId]}`, againOptions)
        }
    })
}

start();