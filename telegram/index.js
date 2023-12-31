const {Telegraf, session, Markup, Telegram} = require('telegraf')
const {Stage, BaseScene} = require('telegraf/scenes')

const support = new BaseScene('support')
support.enter(async (ctx) => {
  try {
    await ctx.reply('📝 Задайте интересующий Вас вопрос :')
  } catch(e) {
      console.log(e)
  }
})
support.on('message', async (ctx) => {
 try {

   if (!ctx.message.text) return ctx.reply('⛔ Пожалуйста отправьте Ваш вопрос в текстовом виде!')

   await ctx.telegram.sendMessage(process.env.SUPPORT_GROUP, `✉ \\|\\ Новый вопрос\nОт: @${ctx.message.from.username ? ctx.message.from.username : 'Никнейма нету'}\nВопрос: ${"`" + ctx.message.text + "`"}\n\n📝 Чтобы ответить на вопрос введите\n` + '`/ответ ' + ctx.chat.id + ' Ваш ответ`', { parse_mode: 'MarkdownV2' })
   await ctx.reply('✉ Ваш вопрос был отослан! Ожидайте ответа от тех. поддержки')
   await ctx.scene.leave()
 } catch(e) {
     console.log(e)
 }
})

const orderIssue = new BaseScene('orderIssue')
orderIssue.enter(async (ctx) => {
  try {
    await ctx.reply('✉ Запишите ваш ответ')
  } catch(e) {
      console.log(e)
  }
})
orderIssue.on('message', async (ctx) => {
  try {
    await ctx.telegram.sendMessage(process.env.ORDER_GROUP, `✉ \\|\\ Ответ от: ${ctx.message.from.first_name}\nОтвет: ${"`" + ctx.message.text + "`"}\n\n📝 Чтобы ответить введите\n` + '`/ответ ' + ctx.chat.id + ' Ваш ответ`', { parse_mode: 'MarkdownV2' })
    await ctx.scene.leave()
  } catch(e) {
      console.log(e)
  }
})

const bot = new Telegraf(process.env.BOT_TOKEN)
const telegram = new Telegram(process.env.BOT_TOKEN)
const stage = new Stage([support, orderIssue])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
  try {
    ctx.reply(`Добро пожаловать в Delivery Pub !`, Markup.inlineKeyboard([
      [Markup.button.webApp('🍺 Каталог', process.env.CLIENT_URL), Markup.button.callback('✉ Задать вопрос', 'support')]
    ]))
  } catch(e) {
      console.log(e)
  }
})

bot.action('support', async (ctx) => {
    try {
      await ctx.scene.enter('support')
    } catch(e) {
        console.log(e)
    }
})

bot.action('rs', (ctx) => {
  try {
    ctx.editMessageReplyMarkup();
    ctx.scene.enter('orderIssue')
  } catch(e) {
      console.log(e)
  }
})

bot.hears(/\ответ \d{9} /, async ctx => {
  try {
    if (ctx.chat.id === +process.env.SUPPORT_GROUP) {
      await ctx.telegram.sendMessage(ctx.message.text.match(/\d{9}/).join(), '✉ Новое уведомление\\!\\\nОтвет от тех\\.\\ поддержки:\n\n`' + ctx.message.text.substring(17) + '`', { parse_mode: 'MarkdownV2' })
    }
    else if (ctx.chat.id === +process.env.ORDER_GROUP) {
      await ctx.telegram.sendMessage(ctx.message.text.match(/\d{9}/).join(), '✉ Новое уведомление\\!\\\nПо поводу заказа:\n\n`' + ctx.message.text.substring(17) + '`', {parse_mode : 'MarkdownV2', ...Markup.inlineKeyboard([Markup.button.callback('📝 Ответить', 'rs')])})
    }
  } catch(e) {
      console.log(e)
  }
})

const launchBot = () => bot.launch();

const answerWebAppQuery = async (data) => {
  try {
    let msgText = '📦 Заказ оформлен:\n'


    data.order.forEach(order => {
      msgText += `---------------------------\n🔹 Название: ${order.name}, Количество : ${order.amount}\n`
    })

    msgText +=
      `---------------------------
Данные о доставке:
📗 Имя: ${data.delivery.name}
📞 Телефон: ${data.delivery.telephone}
📮 Адрес: ${data.delivery.address}
${data.delivery.surrender ? '💵' : '💳'} Тип оплаты: ${data.delivery.paymentType} ${data.delivery.surrender ? `, сдача с ${data.delivery.surrender}₽` : ''}
💰 Итоговая стоимость: ${data.price}₽
${data.delivery.com ? `✉ Комментарий : ${data.delivery.com}` : ''}\n`

    await telegram.answerWebAppQuery(data.queryId, {
      type: 'article',
      id: data.queryId,
      title: 'Покупка',
      input_message_content : {
        message_text : msgText
      }
    })

    await telegram.sendMessage(process.env.ORDER_GROUP, msgText)
    await telegram.sendMessage(process.env.ORDER_GROUP, `📝 Чтобы ответить пользователю ${data.delivery.name}, введите\n` + '`/ответ ' + data.userId + ' Ваш ответ`', { parse_mode: 'MarkdownV2'})
  } catch(e) {
      console.log(e)
  }
}

module.exports = {launchBot, answerWebAppQuery}