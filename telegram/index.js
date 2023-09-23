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

  let msgText = 'Заказ оформлен:\n'

  data.order.forEach(order => {
    msgText += `Название: ${order.name}, Стиль : ${order.style}, Количество : ${order.amount}\n`
  })

  await telegram.answerWebAppQuery(data.queryId, {
    type: 'article',
    id: data.queryId,
    title: 'Покупка',
    input_message_content : {
      message_text : msgText
    }
  })
}

module.exports = {launchBot, answerWebAppQuery}