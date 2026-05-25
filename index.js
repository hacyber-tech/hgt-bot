// Replace bot.launch() with an exported fetch handler
export default {
  async fetch(request, env, ctx) {
    // 1. Initialize Telegraf with the token from the environment
    const bot = new Telegraf(env.BOT_TOKEN);
    
    // 2. Add your existing bot logic here...
    
    // 3. Handle the webhook request
    try {
      await bot.handleUpdate(await request.json());
      return new Response('OK', { status: 200 });
    } catch (err) {
      return new Response(err.message, { status: 500 });
    }
  },
};
