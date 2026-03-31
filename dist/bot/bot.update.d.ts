import { Context } from 'telegraf';
import { SolanaService } from '../solana/solana.service';
export declare class BotUpdate {
    private solanaService;
    constructor(solanaService: SolanaService);
    onStart(ctx: Context): Promise<void>;
    onHelp(ctx: Context): Promise<void>;
    onWatch(ctx: Context): Promise<void>;
    onUnwatch(ctx: Context): Promise<void>;
    onList(ctx: Context): Promise<void>;
    onPortfolio(ctx: Context): Promise<void>;
    onTxHistory(ctx: Context): Promise<void>;
    onPrice(ctx: Context): Promise<void>;
    onStats(ctx: Context): Promise<void>;
    onMinSize(ctx: Context): Promise<void>;
    onText(ctx: Context, text: string): Promise<void>;
    private extractArg;
    private trackUser;
    private addWallet;
    private removeWallet;
    private showPortfolio;
    private showTxHistory;
    private showPrice;
    private setMinSize;
}
