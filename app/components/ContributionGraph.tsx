import type { ContributionDay } from "../lib/github";

// Level 0 is "no contributions"; 1–4 get progressively stronger shades of the accent colour.
const levelColors = [
  "rgba(127, 127, 127, 0.18)",
  "color-mix(in srgb, var(--color-primary-500) 35%, transparent)",
  "color-mix(in srgb, var(--color-primary-500) 55%, transparent)",
  "color-mix(in srgb, var(--color-primary-500) 78%, transparent)",
  "var(--color-primary-500)",
];

const monthName = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleString("en-US", { month: "short", timeZone: "UTC" });

export default function ContributionGraph({
  days,
  total,
}: {
  days: ContributionDay[];
  total: number;
}) {
  // Pad the first week so every column starts on a Sunday.
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const cells: (ContributionDay | null)[] = [...Array(offset).fill(null), ...days];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // Label a column when its month differs from the previous label (and there is room for it).
  let lastMonth = "";
  let lastLabelAt = -10;
  const labels = weeks.map((week, i) => {
    const firstDay = week.find((d) => d !== null);
    if (!firstDay) return "";
    const month = monthName(firstDay.date);
    if (month === lastMonth || i - lastLabelAt < 3) return "";
    lastMonth = month;
    lastLabelAt = i;
    return month;
  });

  return (
    <div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-bold text-black dark:text-white">{total.toLocaleString("en-US")}</span>{" "}
        contributions in the last year
      </p>

      <div className="overflow-x-auto pb-2">
        <div className="w-max">
          <div className="mb-1 flex h-4 gap-[3px] text-xs text-gray-500 dark:text-gray-400">
            {weeks.map((_, i) => (
              <div key={i} className="w-[10px] shrink-0 whitespace-nowrap">
                {labels[i]}
              </div>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }, (_, d) => {
                  const day = week[d];
                  return (
                    <div
                      key={d}
                      title={day ? `${day.count} contributions on ${day.date}` : undefined}
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{ background: day ? levelColors[day.level] : "transparent" }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-1 flex items-center justify-end gap-1 text-xs text-gray-500 dark:text-gray-400">
        Less
        {levelColors.map((color, i) => (
          <span
            key={i}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={{ background: color }}
          />
        ))}
        More
      </div>
    </div>
  );
}
