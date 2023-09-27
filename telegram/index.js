const {Telegraf, session, Markup, Telegram} = require('telegraf')
const {Stage, BaseScene} = require('telegraf/scenes')

const support = new BaseScene('support')
support.on('message', ctx =>  {
  ctx.forwardMessage(process.env.SUPPORT_GROUP, ctx.message.chat.id, ctx.message.message_id)
  return ctx.scene.leave()
})
support.action('end', async (ctx) => {
  await telegram.editMessageText(ctx.chat.id, ctx.update.callback_query.message.message_id, undefined, ctx.update.callback_query.message.text, Markup.inlineKeyboard([]))
  return ctx.scene.leave()
})

const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)
const stage = new Stage([support])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
  ctx.reply(`Добро пожаловать в Delivery Pub !`, Markup.inlineKeyboard([
    Markup.button.webApp('Сайт', `${process.env.CLIENT_URL}`),
    Markup.button.callback('Тех. поддержка', 'supportEnter')
  ]))
})

bot.action('supportEnter', async (ctx) => {
  await ctx.reply('Задайте интирисующий вас вопрос')
  return ctx.scene.enter('support')
})

bot.action(/supportRes/, async (ctx) => {
  await telegram.editMessageText(ctx.chat.id, ctx.update.callback_query.message.message_id, undefined, ctx.match.input.replace(/^.{11}/, ''), Markup.inlineKeyboard([
    Markup.button.callback('Завершить сеанс', 'end')
  ]))
  return ctx.scene.enter('support')
})

bot.on('message', ctx => {
  if (ctx.chat.id === +process.env.SUPPORT_GROUP && ctx.message.reply_to_message && ctx.message.reply_to_message.forward_from) {
    return telegram.sendMessage(ctx.message.reply_to_message.forward_from.id, '✉ Ответ от тех. поддержки:', Markup.inlineKeyboard([
      Markup.button.callback('Прочитать', `supportRes-${ctx.message.text}`),
    ]))
  }
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
Тип оплаты: ${data.delivery.paymentType} ${data.delivery.surrender ? `, сдача с ${data.delivery.surrender}₽` : ''}
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