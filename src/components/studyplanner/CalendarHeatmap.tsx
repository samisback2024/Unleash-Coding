interface Props {
  sessions: { session_date: string; duration_minutes: number }[];
}

function getColor(minutes: number): string {
  if (minutes === 0) return "bg-[#1e2130]";
  if (minutes < 20) return "bg-[#6c63ff]/30";
  if (minutes < 45) return "bg-[#6c63ff]/60";
  if (minutes < 90) return "bg-[#6c63ff]/85";
  return "bg-[#6c63ff]";
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarHeatmap({ sessions }: Props) {
  // Build map: date string → total minutes
  const minuteMap: Record<string, number> = {};
  for (const s of sessions) {
    minuteMap[s.session_date] =
      (minuteMap[s.session_date] ?? 0) + s.duration_minutes;
  }

  // Generate last 16 weeks (112 days)
  const today = new Date();
  const cells: { date: string; minutes: number; dayOfWeek: number }[] = [];

  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    cells.push({
      date: dateStr,
      minutes: minuteMap[dateStr] ?? 0,
      dayOfWeek: d.getDay() === 0 ? 6 : d.getDay() - 1, // 0=Mon…6=Sun
    });
  }

  // Group into weeks (columns of 7)
  const weeks: (typeof cells)[] = [];
  let week: typeof cells = [];
  // Pad the first week
  const firstDayOfWeek = cells[0].dayOfWeek;
  for (let i = 0; i < firstDayOfWeek; i++)
    week.push({ date: "", minutes: 0, dayOfWeek: i });
  for (const cell of cells) {
    week.push(cell);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7)
      week.push({ date: "", minutes: 0, dayOfWeek: week.length });
    weeks.push(week);
  }

  const totalMinutes = sessions.reduce(
    (s, sess) => s + sess.duration_minutes,
    0,
  );
  const activeDays = new Set(sessions.map((s) => s.session_date)).size;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#f1f5f9]">
          Study Activity (last 16 weeks)
        </p>
        <div className="flex gap-3 text-xs text-[#94a3b8]">
          <span>
            <strong className="text-[#f1f5f9]">{activeDays}</strong> active days
          </span>
          <span>
            <strong className="text-[#f1f5f9]">
              {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
            </strong>{" "}
            total
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-fit">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            <div className="h-5" />
            {/* spacer for month row */}
            {DAYS.map((d) => (
              <div
                key={d}
                className="h-4 text-[10px] text-[#64748b] leading-4 pr-1 text-right"
              >
                {d}
              </div>
            ))}
          </div>
          {/* Weeks */}
          {weeks.map((wk, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {/* Month label for first week of month */}
              <div className="h-5 text-[10px] text-[#64748b] leading-5">
                {wk[0]?.date && new Date(wk[0].date).getDate() <= 7
                  ? new Date(wk[0].date).toLocaleString("default", {
                      month: "short",
                    })
                  : ""}
              </div>
              {wk.map((cell, di) => (
                <div
                  key={di}
                  className={`w-4 h-4 rounded-sm transition-colors ${cell.date ? getColor(cell.minutes) : "bg-transparent"}`}
                  title={cell.date ? `${cell.date}: ${cell.minutes} min` : ""}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-[10px] text-[#64748b]">
        <span>Less</span>
        {[
          "bg-[#1e2130]",
          "bg-[#6c63ff]/30",
          "bg-[#6c63ff]/60",
          "bg-[#6c63ff]/85",
          "bg-[#6c63ff]",
        ].map((c) => (
          <div key={c} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
