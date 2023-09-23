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

const answerWebAppQuery = async (data) => {
  await telegram.answerWebAppQuery(data.queryId, {
    type: 'article',
    id: data.queryId,
    title: 'Покупка',
    input_message_content : {
      message_text : 'Успешная покупка\n Приходите ещё %0A Будем вас рады видеть' + data.order[0].name
    }
  })
}

module.exports = {launchBot, answerWebAppQuery}