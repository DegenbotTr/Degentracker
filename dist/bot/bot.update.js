"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const solana_service_1 = require("../solana/solana.service");
const pendingAction = new Map();
let BotUpdate = class BotUpdate {
    constructor(solanaService) {
        this.solanaService = solanaService;
    }
    async onStart(ctx) {
        await ctx.reply(`🚀 <b>Sol Wallet Watcher</b>\n` +
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
            `/help — show this menu`, { parse_mode: 'HTML' });
    }
    async onHelp(ctx) {
        await ctx.reply(`📖 <b>Commands</b>\n` +
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
            `/minsize — set minimum trade size to alert`, { parse_mode: 'HTML' });
    }
    async onWatch(ctx) {
        const address = this.extractArg(ctx);
        if (address) {
            await this.addWallet(ctx, address);
            return;
        }
        pendingAction.set(ctx.chat.id, 'watch');
        await ctx.reply(`👛 <b>Add Wallet</b>\n\nPaste the Solana wallet address you want to watch:`, { parse_mode: 'HTML' });
    }
    async onUnwatch(ctx) {
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
        await ctx.reply(`🗑 <b>Remove Wallet</b>\n\nPaste the address to remove:\n\n${list}`, { parse_mode: 'HTML' });
    }
    async onList(ctx) {
        const wallets = this.solanaService.getWatchedWallets(ctx.chat.id);
        if (wallets.length === 0) {
            await ctx.reply(`📭 <b>No wallets watched yet</b>\n\nUse /watch to add one.`, { parse_mode: 'HTML' });
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
        await ctx.reply(`👁 <b>Watched Wallets</b> (${wallets.length})\n━━━━━━━━━━━━━━━━━━━━\n${list}${filterLine}`, { parse_mode: 'HTML' });
    }
    async onPortfolio(ctx) {
        const address = this.extractArg(ctx);
        if (address) {
            await this.showPortfolio(ctx, address);
            return;
        }
        pendingAction.set(ctx.chat.id, 'portfolio');
        await ctx.reply(`💼 <b>Portfolio Lookup</b>\n\nPaste the Solana wallet address to check:`, { parse_mode: 'HTML' });
    }
    async onTxHistory(ctx) {
        const address = this.extractArg(ctx);
        if (address) {
            await this.showTxHistory(ctx, address);
            return;
        }
        pendingAction.set(ctx.chat.id, 'txhistory');
        await ctx.reply(`📜 <b>Transaction History</b>\n\nPaste the Solana wallet address:`, { parse_mode: 'HTML' });
    }
    async onPrice(ctx) {
        const arg = this.extractArg(ctx);
        if (arg) {
            await this.showPrice(ctx, arg);
            return;
        }
        pendingAction.set(ctx.chat.id, 'price');
        await ctx.reply(`💲 <b>Token Price</b>\n\nPaste a token mint address or symbol (e.g. <code>SOL</code>, <code>BONK</code>):`, { parse_mode: 'HTML' });
    }
    async onMinSize(ctx) {
        const arg = this.extractArg(ctx);
        if (arg) {
            await this.setMinSize(ctx, arg);
            return;
        }
        const current = this.solanaService.getMinTradeSize(ctx.chat.id);
        pendingAction.set(ctx.chat.id, 'minsize');
        await ctx.reply(`⚙️ <b>Minimum Alert Size</b>\n\n` +
            `Current: <b>${current > 0 ? `$${current}` : 'All trades (no filter)'}</b>\n\n` +
            `Enter a USD amount — you'll only get alerts for trades above this value.\nSend <b>0</b> to receive all alerts.`, { parse_mode: 'HTML' });
    }
    async onText(ctx, text) {
        if (text.startsWith('/'))
            return;
        const chatId = ctx.chat.id;
        const action = pendingAction.get(chatId);
        if (!action)
            return;
        pendingAction.delete(chatId);
        const input = text.trim();
        if (action === 'watch')
            await this.addWallet(ctx, input);
        else if (action === 'unwatch')
            await this.removeWallet(ctx, input);
        else if (action === 'portfolio')
            await this.showPortfolio(ctx, input);
        else if (action === 'txhistory')
            await this.showTxHistory(ctx, input);
        else if (action === 'price')
            await this.showPrice(ctx, input);
        else if (action === 'minsize')
            await this.setMinSize(ctx, input);
    }
    extractArg(ctx) {
        const text = ctx.message?.text || '';
        const parts = text.trim().split(/\s+/);
        return parts[1] || null;
    }
    async addWallet(ctx, address) {
        const success = this.solanaService.watchWallet(address, ctx.chat.id);
        if (!success) {
            await ctx.reply(`❌ <b>Invalid address</b>\n\nCouldn't recognise that as a Solana wallet. Double-check and try again.`, { parse_mode: 'HTML' });
            return;
        }
        const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
        await ctx.reply(`✅ <b>Wallet Added</b>\n━━━━━━━━━━━━━━━━━━━━\n` +
            `👛 <a href="https://solscan.io/account/${address}">${short}</a>\n` +
            `<code>${address}</code>\n\n` +
            `You'll be notified on every buy and sell.\nUse /minsize to filter small trades.`, { parse_mode: 'HTML' });
    }
    async removeWallet(ctx, address) {
        const success = this.solanaService.unwatchWallet(address, ctx.chat.id);
        if (!success) {
            await ctx.reply(`❌ That wallet isn't in your watch list.\nUse /list to see what you're watching.`);
            return;
        }
        const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
        await ctx.reply(`🗑 <b>Wallet Removed</b>\n\n<code>${short}</code> is no longer being watched.`, { parse_mode: 'HTML' });
    }
    async showPortfolio(ctx, address) {
        const loading = await ctx.reply('⏳ Fetching portfolio data...');
        const result = await this.solanaService.getPortfolio(address);
        await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, undefined, result, { parse_mode: 'HTML' });
    }
    async showTxHistory(ctx, address) {
        const loading = await ctx.reply('⏳ Loading transaction history...');
        const result = await this.solanaService.getTxHistory(address);
        await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, undefined, result, { parse_mode: 'HTML' });
    }
    async showPrice(ctx, mintOrSymbol) {
        const loading = await ctx.reply('⏳ Fetching price...');
        const result = await this.solanaService.getTokenPrice(mintOrSymbol);
        await ctx.telegram.editMessageText(ctx.chat.id, loading.message_id, undefined, result, { parse_mode: 'HTML' });
    }
    async setMinSize(ctx, input) {
        const value = parseFloat(input);
        if (isNaN(value) || value < 0) {
            await ctx.reply(`❌ Invalid amount. Please enter a number like <code>100</code> or <code>0</code> to disable.`, { parse_mode: 'HTML' });
            return;
        }
        this.solanaService.setMinTradeSize(ctx.chat.id, value);
        await ctx.reply(value === 0
            ? `✅ <b>Filter removed</b> — you'll receive alerts for all trades.`
            : `✅ <b>Min alert size set to $${value}</b>\n\nYou'll only be notified for trades above this value.`, { parse_mode: 'HTML' });
    }
};
exports.BotUpdate = BotUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('help'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onHelp", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('watch'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onWatch", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('unwatch'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onUnwatch", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('list'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onList", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('portfolio'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onPortfolio", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('txhistory'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onTxHistory", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('price'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onPrice", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('minsize'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onMinSize", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __param(1, (0, nestjs_telegraf_1.Message)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context, String]),
    __metadata("design:returntype", Promise)
], BotUpdate.prototype, "onText", null);
exports.BotUpdate = BotUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [solana_service_1.SolanaService])
], BotUpdate);
//# sourceMappingURL=bot.update.js.map