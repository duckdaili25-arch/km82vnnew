const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const BOT_TOKEN = "8835282501:AAH_0h9Wjlt5QqHthbTmNCKo3Ap0VzU9lAw";
const GAS_URL = "https://script.google.com/macros/s/AKfycbxBYbl8B9fF7tvihQsuTivk-Mag54C0SVjqkWkuyj-26H_KOcRR9W9hHBRMgfWMBcU4/exec";

const bot = new Telegraf(BOT_TOKEN);

bot.on('text', async (ctx) => {
  const text = ctx.message.text.trim();
  const chatId = ctx.chat.id;

  if (!text || text.startsWith('/')) {
    return ctx.reply("❌ Chỉ cần gửi ID, không gửi lệnh như /start");
  }

  try {
    const r = await fetch(`${GAS_URL}?text=${encodeURIComponent(text)}`);
    if (!r.ok) return ctx.reply("❌ Lỗi server GAS");

    const results = await r.json();
    if (!results || !Array.isArray(results) || results.length === 0) {
      return ctx.reply(`❌ Không tìm thấy ID: ${text}`);
    }

    for (const res of results) {
      const textClean = removeCommaInBonus(res.text);
      const mdText = "```\n" + textClean + "\n```";
      await ctx.reply(mdText, { parse_mode: 'Markdown' });
    }
  } catch (e) {
    console.error("Bot error:", e);
  }
});

function removeCommaInBonus(text) {
  return text.replace(/(💰 THƯỞNG: )([\d,]+)/, (match, p1, p2) => {
    return p1 + p2.replace(/,/g, "");
  });
}

bot.launch().then(() => {
  console.log("🤖 Bot Telegram đang chạy thành công!");
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
