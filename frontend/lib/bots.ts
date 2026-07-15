export type BotStatus = "live" | "beta" | "coming-soon";

export type BotCommand = {
  command: string;
  description: string;
};

export type Bot = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: BotStatus;
  chain: string;
  telegramUrl: string;
  category: string;
  accent: "green" | "purple" | "amber" | "cyan";
  features: string[];
  commands: BotCommand[];
  stack: string[];
};

export const bots: Bot[] = [
  {
    slug: "sol-wallet-watcher",
    name: "DegenTrack",
    tagline: "Real-time wallet tracking + multi-chain token scanner.",
    description:
      "Watch any Solana wallet and get instant alerts on buys & sells with USD value, token amounts, and price paid. Paste any token contract — Solana or EVM (Ethereum, BSC, Base, Arbitrum) — for a full info card with price, market cap, liquidity, and security checks. Plus portfolio snapshots, PnL analysis, group call tracking, and live prices — all inside Telegram.",
    status: "live",
    chain: "Solana + EVM",
    telegramUrl: "https://t.me/De1trackBot",
    category: "On-chain monitoring",
    accent: "green",
    features: [
      "Real-time Solana buy/sell alerts via Helius WebSocket",
      "Multi-chain token cards — Solana, Ethereum, BSC, Base & Arbitrum",
      "EVM security checks via GoPlus — honeypot, buy/sell tax, mintable, ownership",
      "Solana security via RugCheck — mint/freeze authority, top holders, dev sold",
      "One-tap trade buttons per chain (Trojan, Photon, Maestro, Banana, BullX)",
      "Portfolio snapshot with SPL tokens, SOL, and USD value",
      "PnL analysis with realized/unrealized gains tracking",
      "Wallet leaderboard and open positions view",
      "Historical trade backfill for complete PnL tracking",
      "Per-user and per-wallet minimum USD trade filters",
      "Wallet labels, tags, and pause/resume per wallet",
      "Group call tracking with first-caller credit, trending & leaderboard",
      "Live-refresh button on token cards for fresh price & market cap",
    ],
    commands: [
      { command: "/start", description: "Boot the bot and show the main menu" },
      {
        command: "/watch <address>",
        description: "Track a new Solana wallet (admins only in groups)",
      },
      {
        command: "/unwatch <address>",
        description: "Stop tracking a wallet (admins only in groups)",
      },
      { command: "/list", description: "View all tracked wallets" },
      { command: "/label", description: "Give a wallet a custom name" },
      { command: "/tag", description: "Add a tag to a wallet for filtering" },
      { command: "/untag", description: "Remove a tag from a wallet" },
      {
        command: "/topwallets",
        description: "View your best performing tracked wallets",
      },
      {
        command: "/portfolio <address>",
        description: "Check wallet's token holdings and USD values",
      },
      {
        command: "/positions <address>",
        description: "View open positions for a wallet",
      },
      {
        command: "/pnl <address>",
        description: "Show profit/loss analysis with wins/losses",
      },
      {
        command: "/txhistory <address>",
        description: "View last transactions for a wallet",
      },
      {
        command: "/backfill <address>",
        description: "Import last 100 transactions for PnL tracking",
      },
      {
        command: "/price <mint>",
        description: "Check any token price by mint address or symbol",
      },
      {
        command: "<paste CA>",
        description:
          "Paste any Solana or EVM contract for a full token info card",
      },
      {
        command: "/minsize <usd>",
        description: "Set minimum trade alert size filter (0 for all)",
      },
      { command: "/stats", description: "View bot usage statistics" },
      { command: "/menu", description: "Show main menu" },
      { command: "/help", description: "Show all available commands" },
      {
        command: "/trending",
        description: "Most-called tokens in group (24h, any chain)",
      },
      {
        command: "/leaderboard",
        description: "View top callers by performance in group",
      },
    ],
    stack: [
      "NestJS",
      "Telegraf",
      "Prisma",
      "PostgreSQL",
      "@solana/web3.js",
      "Helius RPC + DAS",
      "DexScreener API",
      "GoPlus Security",
      "GeckoTerminal",
      "RugCheck",
    ],
  },
];

export const getBot = (slug: string): Bot | undefined =>
  bots.find((bot) => bot.slug === slug);
