const {Telegraf, session, Markup, Telegram} = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)

bot.use(session())

bot.start((ctx) => {
  ctx.reply(`Выберете действие:`, Markup.inlineKeyboard([
    Markup.button.webApp('Сайт', `${process.env.CLIENT_URL}`),
  ]))
  ctx.reply('Тех-поддержка', Markup.keyboard([
    ['лааллалала'],
    ['Техническая поддержка']
  ]))
})
bot.on('Техническая поддержка', ctx => {
  console.log(ctx.chat)
  console.log(ctx.message)
  ctx.forwardMessage(process.env.SUPPORT_GROUP, ctx.chat.id, ctx.message.id)
})
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
Итоговая стоимость: ${data.price}₽
${data.delivery.com ? `Комментарий : ${data.delivery.com}` : ''}\n`

  await telegram.answerWebAppQuery(data.queryId, {
    type: 'article',
    id: data.queryId,
    title: 'Покупка',
    input_message_content : {
      message_text : msgText
    }
  })

  msgText += `---------------------------\nСсылка на пользователя: ${data.userLink}`

  await telegram.sendMessage(process.env.ORDER_GROUP, msgText)
}

module.exports = {launchBot, answerWebAppQuery}