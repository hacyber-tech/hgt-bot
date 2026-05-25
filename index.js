require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// --- Command: Start ---
bot.start((ctx) => ctx.reply('🛡️ *HGT-BoT Initialized.*\nWelcome to Hacyber Global Tech. Use the menu to access services.', { parse_mode: 'Markdown' }));

// --- Command: Privacy ---
bot.command("privacy", (ctx) => {
    ctx.replyWithMarkdownV2(
        `🛡️ *HGT\\-BoT | PRIVACY & DATA SECURITY*\n\n` +
        `Data protection framework: HACYBERGLOBALTECH™\\.\n` +
        `🔐 *Full Policy:* [Click Here](https://gist.github.com/hacyber-tech/bdd485588d259e77d59fabd05d26ae55)\n\n` +
        `For support, contact: @your_admin`
    );
});

// --- Command: Pay ---
bot.command('pay', (ctx) => {
    ctx.reply('💳 *HGT Payment Channels*\n\n1. USDT (TRC20)\n2. USDT (ERC20)\n3. Bank Transfer\n\n*Note:* Only use Friends & Family (F&F).', { parse_mode: 'Markdown' });
});

bot.launch().then(() => console.log('🚀 HGT-BoT Engine: Fully Operational.'));
