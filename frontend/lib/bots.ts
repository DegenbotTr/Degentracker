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
    tagline: "Real-time Solana wallet tracker for traders.",
    description:
      "Watch any Solana wallet and get instant alerts on buys & sells with USD value, token amounts, and price paid. Also check portfolio snapshots, transaction history, PnL analysis, and live token prices — all inside Telegram.",
    status: "live",
    chain: "Solana",
    telegramUrl: "https://t.me/De1trackBot",
    category: "On-chain monitoring",
    accent: "green",
    features: [
      "Real-time buy/sell alerts via Helius WebSocket",
      "Portfolio snapshot with SPL tokens, SOL, and USD value",
      "PnL analysis with realized/unrealized gains tracking",
      "Wallet leaderboard showing best performers",
      "Open positions view with current token holdings",
      "Historical trade backfill for complete PnL tracking",
      "Per-user and per-wallet minimum USD trade filters",
      "Wallet labels and tags for organization",
      "Pause/resume notifications per wallet",
      "Group token call tracking with leaderboard and trending",
      "Token info cards with market cap and performance",
      "Chain guard rejects EVM / BTC / TRON addresses",
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
        command: "/minsize <usd>",
        description: "Set minimum trade alert size filter (0 for all)",
      },
      { command: "/stats", description: "View bot usage statistics" },
      { command: "/menu", description: "Show main menu" },
      { command: "/help", description: "Show all available commands" },
      {
        command: "/trending",
        description: "View most-called tokens in group (24h)",
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
      "Jupiter Price API",
      "DexScreener API",
    ],
  },
];

export const getBot = (slug: string): Bot | undefined =>
  bots.find((bot) => bot.slug === slug);
