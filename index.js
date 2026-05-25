const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID; 

const userSession = new Map();
const mainMenuMarkup = Markup.keyboard([
    ['🟩 View Payment Options', '📝 Submit Verification'],
    ['⏳ Check Link Status', '📞 Contact Support']
]).resize();

bot.on('message', async (ctx) => {
    const text = ctx.message.text || '';
    const userId = ctx.from.id;

    // 1. Capture Web Portal Lead
    if (text.startsWith('🔐 Bot‑Grabber Activation Request')) {
        if (ADMIN_ID) {
            await bot.telegram.sendMessage(ADMIN_ID, `🚨 *NEW WEB-PORTAL LEAD*\n\n${text}`, { parse_mode: 'Markdown' });
        }
        return ctx.reply('✅ Activation request received! Your details have been forwarded to administration.');
    }

    // 2. Manual Verification Workflow
    const session = userSession.get(userId);
    if (text === '📝 Submit Verification' || text === '/verify') {
        userSession.set(userId, { stage: 'AWAITING_DETAILS' });
        return ctx.reply('📝 Please reply with your Payment Details (Name/Reference):');
    }

    if (session?.stage === 'AWAITING_DETAILS' && text) {
        session.details = text;
        session.stage = 'AWAITING_SCREENSHOT';
        return ctx.reply('📸 Text received. Now, please upload the receipt screenshot.');
    }

    if (session?.stage === 'AWAITING_SCREENSHOT' && ctx.message.photo) {
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        if (ADMIN_ID) {
            await bot.telegram.sendPhoto(ADMIN_ID, fileId, {
                caption: `🚨 *NEW MANUAL LEAD*\nUser: @${ctx.from.username || 'N/A'}\nDetails: ${session.details}`
            });
        }
        userSession.delete(userId);
        return ctx.reply('✅ Receipt received! Verification in progress.', mainMenuMarkup);
    }
});

bot.launch().then(() => console.log('🚀 HGT-BoT Engine: Fully Operational.'));
