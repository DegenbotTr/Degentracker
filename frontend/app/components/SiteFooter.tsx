import Link from "next/link";
import { BrandMark } from "./BrandMark";

const COMMUNITY_URL = "https://t.me/Degenhubtrade";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <BrandMark size={30} />
              <span className="text-sm font-semibold text-white">DegenHub</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Home for traders bots — a growing collection of fast, focused
              Telegram trading tools across Solana and EVM chains. Join the
              community and trade alongside other degens.
            </p>
            <a
              href={COMMUNITY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-2/30 bg-accent-2/10 px-4 py-2 text-xs font-medium text-white transition-colors hover:border-accent-2/60"
            >
              <TelegramIcon className="h-3.5 w-3.5 text-accent-2" />
              Join the DegenHub community
            </a>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              Product
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/bots" className="text-zinc-300 hover:text-white">
                  All bots
                </Link>
              </li>
              <li>
                <Link
                  href="/bots/sol-wallet-watcher"
                  className="text-zinc-300 hover:text-white"
                >
                  DegenTrack
                </Link>
              </li>
              <li>
                <Link href="/#how" className="text-zinc-300 hover:text-white">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              Links
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={COMMUNITY_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white"
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/De1trackBot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white"
                >
                  DegenTrack bot
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://solana.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white"
                >
                  Solana
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} DegenHub. Home for traders bots.</p>
          <p className="flex items-center gap-2">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
            All bots operational
          </p>
        </div>
      </div>
    </footer>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.05 3.05 2.98 9.98c-1.23.48-1.22 1.16-.22 1.46l4.63 1.44 10.72-6.76c.51-.31.97-.14.59.2l-8.69 7.85-.34 5.05c.5 0 .72-.22 1-.5l2.4-2.34 4.98 3.68c.92.51 1.58.24 1.81-.85l3.28-15.46c.34-1.38-.53-2-1.42-1.7Z" />
    </svg>
  );
}
