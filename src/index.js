const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BOT_TOKEN = '7869955028:AAEeC5z0EMcJAQEHsBa8yp784yK_OnuDvgM';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const BACKEND_URL = 'http://localhost:8000';
const OFFSET_FILE = path.join(__dirname, 'offset.json');

let offset = loadOffset(); // تحميل offset عند بدء البوت

// ✅ تحميل offset من الملف (أو 0 إذا غير موجود)
function loadOffset() {
  try {
    const raw = fs.readFileSync(OFFSET_FILE);
    const json = JSON.parse(raw);
    return json.offset || 0;
  } catch {
    return 0;
  }
}

// ✅ حفظ offset في الملف
function saveOffset(value) {
  fs.writeFileSync(OFFSET_FILE, JSON.stringify({ offset: value }));
}

async function safeRequest(method, url, data = null, config = {}) {
  try {
    if (method === 'get') {
      const response = await axios.get(url, config);
      return response.data;
    } else {
      const response = await axios.post(url, data, config);
      return response.data;
    }
  } catch (error) {
    console.error('Request failed:', error.message);
    throw error;
  }
}

async function processUpdate(update) {
  const msg = update.message;
  if (!msg) return;

  const chatId = msg.chat.id;

  if (msg.text === '/start') {
    await safeRequest('post', `${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: 'أهلاً بك! الرجاء الضغط على الزر لمشاركة رقم هاتفك.',
      reply_markup: {
        keyboard: [[{ text: '📱 مشاركة رقمي', request_contact: true }]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
    return;
  }

  if (msg.contact) {
    const phoneNumber = msg.contact.phone_number.startsWith('+')
      ? msg.contact.phone_number
      : '+' + msg.contact.phone_number;

    try {
      console.log('Processing contact:', { chatId, phoneNumber });

      const response = await safeRequest(
        'post',
        `${BACKEND_URL}/user/save-chat-id`,
        {
          chatId: chatId,
          phoneNumber: phoneNumber,
        },
      );

      console.log('Backend response:', response);

      await safeRequest('post', `${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: '✅ تم ربط حسابك بنجاح!',
      });
    } catch (error) {
      console.error('❌ Failed to save user:', error.message);
      await safeRequest('post', `${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: 'عذرًا، حدث خطأ أثناء محاولة ربط حسابك. حاول لاحقًا.',
      });
    }
  }
}

async function getUpdates() {
  try {
    const data = await safeRequest('get', `${TELEGRAM_API}/getUpdates`, null, {
      params: {
        offset: offset + 1,
        timeout: 30,
      },
    });

    if (data.result && data.result.length > 0) {
      console.log(`📥 Processing ${data.result.length} updates...`);

      for (const update of data.result) {
        await processUpdate(update);
        offset = update.update_id;
        saveOffset(offset); // ✅ حفظ offset بعد كل عملية
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error in getUpdates:', error.message);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  getUpdates(); // loop
}

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping bot...');
  saveOffset(offset);
  process.exit();
});

console.log('🤖 Bot started...');
getUpdates();
