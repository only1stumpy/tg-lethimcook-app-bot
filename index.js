const TelegramBot = require('node-telegram-bot-api');
const token = '7371809704:AAFqZyHLqBPZazNI5GpI0icrgYX4jJNbK6k';
const bot = new TelegramBot(token, {polling: true});
let webAppUrl = "https://hilarious-salamander-b00bad.netlify.app";
let ownerChatID =  770417666;
let savedID = new Array();
bot.on('message', async (msg) => {
  
  const chatId = msg.chat.id;
  const text = msg.text;
  const username = msg.from.username || `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim() || 'без имени';
  const saveID = searchInArray(savedID, chatId);
  if(text  === '/start'){
    if(!saveID)  {
      await bot.sendMessage(chatId,  `👋 Привет, добро пожаловать в бота клана LET HIM COOK!

Мы - дружелюбное комьюнити, всегда рады новым активным игрокам и общительным людям в нашем чате. Все клановые события мы закрываем на 100%! 

Чтобы подать заявку на вступление, для начала, пожалуйста, прочитай наши правила (советую прочесть правила полностью, ибо в анкете будут вопросы по правилам) 📜. Это поможет нам поддерживать порядок и приятную атмосферу в клане.
      
Ждем тебя в нашем клане и до встречи в бою! ⚔️
      
С уважением,
Твой клановый бот 🤖`,{
          reply_markup: {
            resize_keyboard: true,
              keyboard: [
                  [
                    {text: "📜 Прочесть правила", web_app:{url:webAppUrl}}
                  
              ]
              ]
          }
      });
      savedID.push(chatId);
      console.log(savedID);
  }
  else  {
    await bot.sendMessage(chatId,'Бот уже был запущен.')
  }
  
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg.web_app_data.data);
      if(data.action === 'close'){
        const messageId = msg.message_id;
        await bot.sendMessage(chatId, `Отлично, ты ознакомился с нашими правилами! ✅

Теперь, чтобы подать заявку на вступление в клан LET HIM COOK, пожалуйста, заполни небольшую форму. Нам нужно немного информации о тебе, чтобы убедиться, что ты подходишь для нашего сообщества.
        
Нажми на кнопку ниже, чтобы заполнить форму 📝
        `, {
                            reply_markup: {
                              resize_keyboard: true,
                                keyboard: [
                                    [
                                        { text: "📝 Заполнить форму", web_app: { url: webAppUrl + '/form' } }
                                    ]
                                ]
                            }
                        });
      }
      else {
      console.log(data);
      const messageId = msg.message_id;
        await bot.sendMessage(chatId, `Спасибо за заполнение формы! 📝

Твоя заявка отправлена руководителям клана LET HIM COOK на рассмотрение. Пожалуйста, имей в виду, что шуточные или недобросовестные заявки не принимаются. Мы серьезно подходим к вступлению новых членов в наше сообщество.

Ожидай ответа от нас. Если у нас возникнут дополнительные вопросы или потребуется дополнительная информация, мы свяжемся с тобой.     
        
С уважением,
Твой клановый бот 🤖`,{
reply_markup:{
  keyboard:  [[]]
}});
      await bot.sendMessage(ownerChatID, `Отправлена форма от пользователя: @${username}.
      Игровой ник: ${data.nickname}
      Возраст: ${data.age}
      Количество кубков: ${data.throphy}
      Причина: ${data.desc}
      Кодовое слово: ${data.code}`, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: "Принять", callback_data: `accept_${chatId}` },
                    { text: "Отклонить", callback_data: `reject_${chatId}` }
                ]
            ]
        }
    });
    
    }
    } catch (e) {
      console.log(e);
    }
  }
});


function searchInArray(array, query) {
  return array.includes(query)
}
bot.on('callback_query', async (query) => {
  const newChatID = query.data.split('_')[1];
  const messageId = query.message.message_id;

  if (query.data.startsWith('accept')) {
    console.log("Принят!")
    await bot.sendMessage(newChatID, `Поздравляем! Твоя заявка принята. Добро пожаловать в клан LET HIM COOK! 🎉

Обязательно присоединяйся к нашему чату (ссылку на клан ты найдешь там) и начинай играть вместе с нами: https://t.me/+JzXcFFeJ69RhMTcy`);
  } else if (query.data.startsWith('reject')) {
    await bot.sendMessage(ownerChatID, `Выберите причину отклонения заявки:`, {
        reply_markup: {
          resize_keyboard: true,
            inline_keyboard: [
                [
                    { text: "Недостаточное количество кубков", callback_data: `lowthrophy_${newChatID}` },
                    { text: "Шуточное заполнение формы", callback_data: `roflform_${newChatID}` },
                    { text: "Неправильное кодовое слово", callback_data: `incorrectcode_${newChatID}` }
                ]
            ]
        }
    });
  } else if (query.data.startsWith('lowthrophy'))  {
    let currentChatID = query.data.split('_')[1];
    await bot.sendMessage(currentChatID, `К сожалению, твоя заявка отклонена по причине низкого количества кубков. Удачи в будущих начинаниях! ❌`);
  } else if (query.data.startsWith('roflform'))  {
    let currentChatID = query.data.split('_')[1];
    await bot.sendMessage(currentChatID, `К сожалению, твоя заявка отклонена по причине несерьезного отношения к заполнению формы. Удачи в будущих начинаниях! ❌`);
  } else if (query.data.startsWith('incorrectcode'))   {
    let currentChatID = query.data.split('_')[1];
    await bot.sendMessage(currentChatID, `Ты неправильно ввел кодовое слово, попробуй ещё раз.`,{
      reply_markup: {
        resize_keyboard: true,
          keyboard: [
              [
                {text: "📜 Прочесть правила", web_app:{url:webAppUrl}}
              
          ]
          ]
      }
  });
  }

  bot.answerCallbackQuery(query.id);
});