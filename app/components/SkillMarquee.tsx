import Image from "next/image";

// Glass card with endlessly scrolling rows of skill logos.
// Logos sit muted in grey and light up in full colour on hover; a row pauses while hovered.
export default function SkillMarquee({
  label,
  rows,
  logos,
}: {
  label: string;
  rows: string[][];
  logos: Record<string, string>;
}) {
  return (
    <div className="glass-card reveal">
      <p className="mb-5 px-8 text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <div className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <div key={i} className="marquee">
            {/* The list is rendered twice so the loop is seamless; the copy is hidden from screen readers. */}
            <div className={`marquee-track ${i % 2 ? "marquee-reverse" : ""}`}>
              {[0, 1].map((copy) =>
                row.map((skill) => (
                  <span key={`${copy}-${skill}`} className="marquee-item" aria-hidden={copy === 1}>
                    <Image src={logos[skill]} alt="" width={28} height={28} className="h-7 w-7" />
                    {skill}
                  </span>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
