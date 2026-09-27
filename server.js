const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// توكن البوت تبعك
const BOT_TOKEN = "8520458243:AAExo1h_0nFDp0bRSBLKbijdLIJdrk7Cz_s"; 

// 1. مسار إنشاء فاتورة النجوم
app.post('/create-stars-invoice', async (req, res) => {
  const { userId, stars } = req.body;

  try {
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      title: "شراء منتج تجريبي",
      description: "طلب منتج بـ 10 نجوم داخل الـ Mini App",
      payload: JSON.stringify({ userId, item: 'test_product' }),
      provider_token: "", // فارغ حصراً للنجوم
      currency: "XTR",    // رمز Telegram Stars
      prices: [{ label: "منتج تجريبي", amount: stars || 10 }]
    });

    res.json({ invoiceLink: response.data.result });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "فشل إنشاء الفاتورة" });
  }
});

// 2. مسار استقبال الـ Webhook لتأكيد استلام النجوم
app.post('/webhook', async (req, res) => {
  const update = req.body;

  if (update.pre_checkout_query) {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/answerPreCheckoutQuery`, {
      pre_checkout_query_id: update.pre_checkout_query.id,
      ok: true
    });
  }

  if (update.message?.successful_payment) {
    console.log("تم استلام النجوم بنجاح!", update.message.successful_payment);
  }

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
