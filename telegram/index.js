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

module.exports = {launchBot}