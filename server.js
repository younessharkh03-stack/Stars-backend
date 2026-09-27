const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// ضَع توكن البوت الخاص بك هنا
const BOT_TOKEN = "8520458243:AAExo1h_0nFDp0bRSBLKbijdLIJdrk7Cz_s";

app.post('/create-stars-invoice', async (req, res) => {
  try {
    const { userId, title, price, description } = req.body;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/createInvoiceLink`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title || "منتج تجريبي",
        description: description || "وصف المنتج",
        payload: `user_${userId}_${Date.now()}`,
        currency: "XTR", // عملة نجوم تيليجرام
        prices: [{ label: title, amount: price }] // السعر بالنجوم
      })
    });

    const data = await response.json();
    if (data.ok) {
      res.json({ invoiceLink: data.result });
    } else {
      res.status(400).json({ error: data.description });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
