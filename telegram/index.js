const {Telegraf, session, Markup, Telegram} = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)

bot.use(session())

bot.start((ctx) => {
  ctx.reply(`Выберете действие:`, Markup.inlineKeyboard([
    Markup.button.webApp('Сайт', `${process.env.CLIENT_URL}`),
  ]))
})
bot.on('web_app_data', ctx => ctx.reply('ЛАЛАЛАЛАЛАЛ'))
const launchBot = () => bot.launch();

const answerWebAppQuery = async (data) => {
  let msgText = 'Заказ оформлен:\n'

  data.order.forEach(order => {
    msgText += `---------------------------\nНазвание: ${order.name}, Количество : ${order.amount}\n`
  })

  msgText +=
    `---------------------------
Данные о доставке:
Имя: ${data.delivery.name}
Телефон: ${data.delivery.telephone}
Адрес: ${data.delivery.address}
Тип оплаты: ${data.delivery.paymentType}
${data.delivery.com ? `Комментарий : ${data.delivery.com}` : ''}\n`

  await telegram.answerWebAppQuery(data.queryId, {
    type: 'article',
    id: data.queryId,
    title: 'Покупка',
    input_message_content : {
      message_text : msgText
    }
  })

  msgText += `---------------------------\nСсылка на пользователя: https://web.telegram.org/k/#${data.userId}`
  msgText += `---------------------------\nСсылка на пользователя:<a href="tg://user?id=${data.userId}">parseMode=HTML</a>`
  msgText += `---------------------------\nСсылка на пользователя:tg://openmessage?user_id=${data.usedId}`
  msgText += `---------------------------\nСсылка на пользователя:tg://user?id=${data.userId}`

  await telegram.sendMessage(process.env.ORDER_GROUP, msgText)
}

module.exports = {launchBot, answerWebAppQuery}