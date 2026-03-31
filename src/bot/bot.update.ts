import { Update, Start, Command, Ctx, On, Message } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { SolanaService } from '../solana/solana.service';

type PendingAction =
  | 'watch'
  | 'unwatch'
  | 'portfolio'
  | 'txhistory'
  | 'price'
  | 'minsize';
const pendingAction = new Map<number, PendingAction>();

@Update()
export class BotUpdate {
  constructor(private solanaService: SolanaService) {}

  // ─── Start / Help ───────────────────────────────────────────────────────────

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(
      `🚀 <b>Sol Wallet Watcher</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Track any Solana wallet and get instant alerts on trades.\n\n` +
        `<b>👁 Watching</b>\n` +
        `/watch — add a wallet to watch\n` +
        `/unwatch — remove a wallet\n` +
        `/list — show all watched wallets\n\n` +
        `<b>📊 Research</b>\n` +
        `/portfolio — full token breakdown & value\n` +
        `/txhistory — last 10 transactions\n` +
        `/price — check any token price\n\n` +
        `<b>⚙️ Settings</b>\n` +
        `/minsize — set minimum trade size to alert\n\n` +
        `/help — show this menu`,
      { parse_mode: 'HTML' },
    );
  }

  @Command('help')
  async onHelp(@Ctx() ctx: Context): Promise<void> {
    await ctx.reply(
      `📖 <b>Commands</b>\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `<b>👁 Watching</b>\n` +
        `/watch — add a wallet to watch\n` +
        `/unwatch — remove a wallet\n` +
        `/list — show all watched wallets\n\n` +
        `<b>📊 Research</b>\n` +
        `/portfolio — full token breakdown & value\n` +
        `/txhistory — last 10 transactions\n` +
        `/price — check any token price\n\n` +
        `<b>⚙️ Settings</b>\n` +
        `/minsize — set minimum trade size to alert`,
      { parse_mode: 'HTML' },
    );
  }

  // ─── Watch / Unwatch ────────────────────────────────────────────────────────

  @Command('watch')
  async onWatch(@Ctx() ctx: Context): Promise<void> {
    const address = this.extractArg(ctx);
    if (address) {
      await this.addWallet(ctx, address);
      return;
    }
    pendingAction.set(ctx.chat.id, 'watch');
    await ctx.reply(
      `👛 <b>Add Wallet</b>\n\nPaste the Solana wallet address you want to watch:`,
      { parse_mode: 'HTML' },
    );
  }

  @Command('unwatch')
  async onUnwatch(@Ctx() ctx: Context): Promise<void> {
    const address = this.extractArg(ctx);
    if (address) {
      await this.removeWallet(ctx, address);
      return;
    }

    const wallets = this.solanaService.getWatchedWallets(ctx.chat.id);
    if (wallets.length === 0) {
      await ctx.reply('You have no wallets being watched.');
      return;
    }

    pendingAction.set(ctx.chat.id, 'unwatch');
    const list = wallets
      .map((w, i) => `${i + 1}. <code>${w}</code>`)
      .join('\n');
    await ctx.reply(
      `🗑 <b>Remove Wallet</b>\n\nPaste the address to remove:\n\n${list}`,
      { parse_mode: 'HTML' },
    );
  }

  @Command('list')
  async onList(@Ctx() ctx: Context): Promise<void> {
    const wallets = this.solanaService.getWatchedWallets(ctx.chat.id);

    if (wallets.length === 0) {
      await ctx.reply(
        `📭 <b>No wallets watched yet</b>\n\nUse /watch to add one.`,
        { parse_mode: 'HTML' },
      );
      return;
    }

    const list = wallets
      .map((w, i) => {
        const short = `${w.slice(0, 6)}...${w.slice(-4)}`;
        return `${i + 1}. <a href="https://solscan.io/account/${w}">${short}</a>  <code>${w}</code>`;
      })
      .join('\n');

    const min = this.solanaService.getMinTradeSize(ctx.chat.id);
    const filterLine = min > 0 ? `\n\n⚙️ Min alert size: <b>$${min}</b>` : '';

    await ctx.reply(
      `👁 <b>Watched Wallets</b> (${wallets.length})\n━━━━━━━━━━━━━━━━━━━━\n${list}${filterLine}`,
      { parse_mode: 'HTML' },
    );
  }

  // ─── Portfolio ──────────────────────────────────────────────────────────────

  @Command('portfolio')
  async onPortfolio(@Ctx() ctx: Context): Promise<void> {
    const address = this.extractArg(ctx);
    if (address) {
      await this.showPortfolio(ctx, address);
      return;
    }
    pendingAction.set(ctx.chat.id, 'portfolio');
    await ctx.reply(
      `💼 <b>Portfolio Lookup</b>\n\nPaste the Solana wallet address to check:`,
      { parse_mode: 'HTML' },
    );
  }

  // ─── TX History ─────────────────────────────────────────────────────────────

  @Command('txhistory')
  async onTxHistory(@Ctx() ctx: Context): Promise<void> {
    const address = this.extractArg(ctx);
    if (address) {
      await this.showTxHistory(ctx, address);
      return;
    }
    pendingAction.set(ctx.chat.id, 'txhistory');
    await ctx.reply(
      `📜 <b>Transaction History</b>\n\nPaste the Solana wallet address:`,
      { parse_mode: 'HTML' },
    );
  }

  // ─── Price ──────────────────────────────────────────────────────────────────

  @Command('price')
  async onPrice(@Ctx() ctx: Context): Promise<void> {
    const arg = this.extractArg(ctx);
    if (arg) {
      await this.showPrice(ctx, arg);
      return;
    }
    pendingAction.set(ctx.chat.id, 'price');
    await ctx.reply(
      `💲 <b>Token Price</b>\n\nPaste a token mint address or symbol (e.g. <code>SOL</code>, <code>BONK</code>):`,
      { parse_mode: 'HTML' },
    );
  }

  // ─── Min Trade Size ─────────────────────────────────────────────────────────

  @Command('minsize')
  async onMinSize(@Ctx() ctx: Context): Promise<void> {
    const arg = this.extractArg(ctx);
    if (arg) {
      await this.setMinSize(ctx, arg);
      return;
    }

    const current = this.solanaService.getMinTradeSize(ctx.chat.id);
    pendingAction.set(ctx.chat.id, 'minsize');
    await ctx.reply(
      `⚙️ <b>Minimum Alert Size</b>\n\n` +
        `Current: <b>${current > 0 ? `$${current}` : 'All trades (no filter)'}</b>\n\n` +
        `Enter a USD amount — you'll only get alerts for trades above this value.\nSend <b>0</b> to receive all alerts.`,
      { parse_mode: 'HTML' },
    );
  }

  // ─── Text Handler ────────────────────────────────────────────────────────────

  @On('text')
  async onText(
    @Ctx() ctx: Context,
    @Message('text') text: string,
  ): Promise<void> {
    if (text.startsWith('/')) return;

    const chatId = ctx.chat.id;
    const action = pendingAction.get(chatId);
    if (!action) return;

    pendingAction.delete(chatId);
    const input = text.trim();

    if (action === 'watch') await this.addWallet(ctx, input);
    else if (action === 'unwatch') await this.removeWallet(ctx, input);
    else if (action === 'portfolio') await this.showPortfolio(ctx, input);
    else if (action === 'txhistory') await this.showTxHistory(ctx, input);
    else if (action === 'price') await this.showPrice(ctx, input);
    else if (action === 'minsize') await this.setMinSize(ctx, input);
  }

  // ─── Private Helpers ────────────────────────────────────────────────────────

  private extractArg(ctx: Context): string | null {
    const text = (ctx.message as any)?.text || '';
    const parts = text.trim().split(/\s+/);
    return parts[1] || null;
  }

  private async addWallet(ctx: Context, address: string): Promise<void> {
    const success = this.solanaService.watchWallet(address, ctx.chat.id);
    if (!success) {
      await ctx.reply(
        `❌ <b>Invalid address</b>\n\nCouldn't recognise that as a Solana wallet. Double-check and try again.`,
        { parse_mode: 'HTML' },
      );
      return;
    }
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    await ctx.reply(
      `✅ <b>Wallet Added</b>\n━━━━━━━━━━━━━━━━━━━━\n` +
        `👛 <a href="https://solscan.io/account/${address}">${short}</a>\n` +
        `<code>${address}</code>\n\n` +
        `You'll be notified on every buy and sell.\nUse /minsize to filter small trades.`,
      { parse_mode: 'HTML' },
    );
  }

  private async removeWallet(ctx: Context, address: string): Promise<void> {
    const success = this.solanaService.unwatchWallet(address, ctx.chat.id);
    if (!success) {
      await ctx.reply(
        `❌ That wallet isn't in your watch list.\nUse /list to see what you're watching.`,
      );
      return;
    }
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    await ctx.reply(
      `🗑 <b>Wallet Removed</b>\n\n<code>${short}</code> is no longer being watched.`,
      { parse_mode: 'HTML' },
    );
  }

  private async showPortfolio(ctx: Context, address: string): Promise<void> {
    const loading = await ctx.reply('⏳ Fetching portfolio data...');
    const result = await this.solanaService.getPortfolio(address);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      (loading as any).message_id,
      undefined,
      result,
      { parse_mode: 'HTML' },
    );
  }

  private async showTxHistory(ctx: Context, address: string): Promise<void> {
    const loading = await ctx.reply('⏳ Loading transaction history...');
    const result = await this.solanaService.getTxHistory(address);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      (loading as any).message_id,
      undefined,
      result,
      { parse_mode: 'HTML' },
    );
  }

  private async showPrice(ctx: Context, mintOrSymbol: string): Promise<void> {
    const loading = await ctx.reply('⏳ Fetching price...');
    const result = await this.solanaService.getTokenPrice(mintOrSymbol);
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      (loading as any).message_id,
      undefined,
      result,
      { parse_mode: 'HTML' },
    );
  }

  private async setMinSize(ctx: Context, input: string): Promise<void> {
    const value = parseFloat(input);
    if (isNaN(value) || value < 0) {
      await ctx.reply(
        `❌ Invalid amount. Please enter a number like <code>100</code> or <code>0</code> to disable.`,
        { parse_mode: 'HTML' },
      );
      return;
    }
    this.solanaService.setMinTradeSize(ctx.chat.id, value);
    await ctx.reply(
      value === 0
        ? `✅ <b>Filter removed</b> — you'll receive alerts for all trades.`
        : `✅ <b>Min alert size set to $${value}</b>\n\nYou'll only be notified for trades above this value.`,
      { parse_mode: 'HTML' },
    );
  }
}
