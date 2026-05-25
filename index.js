const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID; // Add your Telegram User ID to .env

const userSession = new Map();

const mainMenuMarkup = Markup.keyboard([
    ['🟩 View Payment Options', '📝 Submit Verification'],
    ['⏳ Check Link Status', '📞 Contact Support']
]).resize();

// 1. Start Command
bot.start((ctx) => {
    userSession.delete(ctx.from.id);
    ctx.reply(
        `🤖 HGT-BoT | HACYBER NEXUS GATEWAY\n\nYour automated portal for secure service deployment.\n🔗 Portal: https://hacyberglobaltech.github.io/Bot.com/`,
        mainMenuMarkup
    );
});

// 2. Payment Details (Fixed MarkdownV2 characters)
const sendPaymentDetails = (ctx) => {
    const paymentText = 
        `🌐 *HACYBER GLOBAL TECH | PAYMENT CHANNELS*\n\n` +
        `💳 *BANK TRANSFER*\n` +
        `• *Account:* \`217061367039\`\n\n` +
        `🅿️ *PAYPAL (F&F ONLY):*\n` +
        `• *Email:* \`hacyber-team@outlook.com\`\n\n` +
        `🪙 *CRYPTO*\n` +
        `• *TRC20:* \`TBdEnSsWQWZAMKiRe54fPi3d45ajyoXqj6\`\n` +
        `• *ERC20/ETH:* \`0x575acfce162dc14fb2f6a7440c0da61c3d5f8a8f\`\n\n` +
        `👉 _Type /verify to submit your receipt._`;
    ctx.replyWithMarkdownV2(paymentText);
};

bot.command('pay', sendPaymentDetails);
bot.hears('🟩 View Payment Options', sendPaymentDetails);

// 3. Verification & Admin Notification Logic
bot.on('message', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSession.get(userId);

    // Initial Trigger
    if (ctx.message.text === '📝 Submit Verification' || ctx.message.text === '/verify') {
        userSession.set(userId, { stage: 'AWAITING_DETAILS' });
        return ctx.reply('📝 *VERIFICATION*\nReply with your Payment Details (Name/Reference/Method):', { parse_mode: 'Markdown' });
    }

    // Process Details
    if (session?.stage === 'AWAITING_DETAILS' && ctx.message.text) {
        session.details = ctx.message.text;
        session.stage = 'AWAITING_SCREENSHOT';
        return ctx.reply('📸 Text received. Now, please **upload the receipt screenshot**.');
    }

    // Process Screenshot & Notify Admin
    if (session?.stage === 'AWAITING_SCREENSHOT' && ctx.message.photo) {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        
        // Notify Admin
        if (ADMIN_ID) {
            await bot.telegram.sendPhoto(ADMIN_ID, fileId, {
                caption: `🚨 *NEW LEAD*\nUser: @${ctx.from.username || 'N/A'}\nDetails: ${session.details}`
            });
        }

        userSession.delete(userId);
        return ctx.reply('✅ Receipt received! Verification in progress (20-45 mins).', mainMenuMarkup);
    }
});

bot.launch().then(() => console.log('🚀 HGT-BoT Engine: Fully Operational.'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
