const {Telegraf, session, Markup, Telegram} = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)

bot.use(session())

bot.start((ctx) => {
  ctx.reply(`Выберете действие:`, Markup.inlineKeyboard([
    Markup.button.webApp('Сайт', `${process.env.CLIENT_URL}`),
  ]))
})
const launchBot = () => bot.launch();

const createInvoiceLink = async () => {
  const link = await telegram.createInvoiceLink({
    title: 'Оплата пива',
    currency: 'RUB',
    description: 'Оплата Пива',
    payload: 128,
    provider_token: '381764678:TEST:66982',
    prices: [{label : 'Пиво такое-то', amount: 500 * 100}]
  })
  return link
}

module.exports = {launchBot, createInvoiceLink}