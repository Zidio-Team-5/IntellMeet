import Card from "../../../shared/ui/Card.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const HOURS = ["9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm"];
const HEAT = [
  [1,2,3,4,2,3,2,1,1], [2,3,4,5,3,4,3,2,1], [1,1,2,3,2,2,1,1,0],
  [3,4,5,4,3,5,4,3,2], [2,2,3,2,1,2,2,1,0],
];

function heatColor(val) {
  if (val === 0) return "var(--muted)";
  const opacity = val / 5;
  return `rgba(69,123,157,${opacity})`;
}

export default function WorkloadHeatmap() {
  return (
    <Card padding="">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <h3 className="font-display text-sm font-semibold text-[var(--text)]">Meeting Heatmap</h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Busiest times this week</p>
      </div>
      <div className="p-5 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="pb-2 pr-3 text-left text-[var(--text-muted)] font-normal" />
              {HOURS.map((h) => (
                <th key={h} className="pb-2 text-center text-[var(--text-muted)] font-normal px-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DAYS.map((day, di) => (
              <tr key={day}>
                <td className="pr-3 py-1 text-[var(--text-muted)] font-medium">{day}</td>
                {HEAT[di].map((val, hi) => (
                  <td key={hi} className="py-1 px-0.5">
                    <div
                      className="mx-auto h-5 w-6 rounded"
                      style={{ background: heatColor(val) }}
                      title={`${val} meetings`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">Low</span>
          {[1,2,3,4,5].map((v) => (
            <div key={v} className="h-3 w-5 rounded" style={{ background: heatColor(v) }} />
          ))}
          <span className="text-xs text-[var(--text-muted)]">High</span>
        </div>
      </div>
    </Card>
  );
}
