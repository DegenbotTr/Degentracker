import { BotCommand } from "@/lib/bots";

export const groupCommands: BotCommand[] = [
  {
    command: "/watch <address>",
    description: "Track a new Solana wallet (admins only)",
  },
  {
    command: "/unwatch <address>",
    description: "Stop tracking a wallet (admins only)",
  },
  { command: "/list", description: "View all tracked wallets in this group" },
  {
    command: "/trending",
    description: "View most-called tokens in group (24h)",
  },
  {
    command: "/leaderboard",
    description: "View top callers by performance in group",
  },
  { command: "/help", description: "Show all available commands" },
];

export function GroupCommandsTable() {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-panel">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-panel-2 text-[11px] uppercase tracking-widest text-muted">
          <tr>
            <th className="px-5 py-3 font-medium">Command</th>
            <th className="px-5 py-3 font-medium">What it does</th>
          </tr>
        </thead>
        <tbody>
          {groupCommands.map((cmd, i) => (
            <tr
              key={cmd.command}
              className={
                i === groupCommands.length - 1
                  ? ""
                  : "border-b border-border/60"
              }
            >
              <td className="px-5 py-3 align-top">
                <code className="font-mono text-xs text-purple-300">
                  {cmd.command}
                </code>
              </td>
              <td className="px-5 py-3 align-top text-zinc-300">
                {cmd.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
