import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
export declare class SolanaService implements OnModuleInit, OnModuleDestroy {
    private config;
    private bot;
    private readonly logger;
    private connection;
    private apiKey;
    private watchedWallets;
    constructor(config: ConfigService, bot: Telegraf);
    onModuleInit(): void;
    onModuleDestroy(): void;
    watchWallet(address: string, chatId: number | null): boolean;
    unwatchWallet(address: string, chatId: number): boolean;
    getWatchedWallets(chatId: number): string[];
    setMinTradeSize(chatId: number, usd: number): void;
    getMinTradeSize(chatId: number): number;
    getPortfolio(address: string): Promise<string>;
    getTxHistory(address: string): Promise<string>;
    getTokenPrice(mintOrSymbol: string): Promise<string>;
    private handleTransaction;
    private detectAction;
    private formatTradeMessage;
    private bar;
}
