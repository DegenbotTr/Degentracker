import Image from "next/image";

/**
 * Square brand avatar — crops the DegenHub banner to the hooded mascot so the
 * logo reads at small sizes (nav, footer). The full banner is used in the hero.
 */
export function BrandMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-lg ring-1 ring-accent-2/30 ${className}`}
      style={{ height: size, width: size }}
    >
      <Image
        src="/degenlogo.png"
        alt="DegenHub"
        fill
        sizes="64px"
        className="object-cover object-[24%_38%] scale-[1.6]"
        priority
      />
    </span>
  );
}
