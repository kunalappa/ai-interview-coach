// GitHub-style activity table: one square per day, darker green means more activity.
const WEEKS = 26;

function ymd(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function level(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

export default function Heatmap({ activity }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // the table ends on the Saturday of this week and starts on a Sunday
  const end = new Date(today);
  end.setDate(today.getDate() + (6 - today.getDay()));
  const start = new Date(end);
  start.setDate(end.getDate() - (WEEKS * 7 - 1));

  const cells = [];
  for (let i = 0; i < WEEKS * 7; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = ymd(d);
    const future = d > today;
    const count = activity[key] || 0;
    cells.push({ key, future, count });
  }

  return (
    <div>
      <div className="heat-wrap">
        <div className="heat" role="img" aria-label="Your practice activity for the last six months">
          {cells.map((c) => (
            <div
              key={c.key}
              className={'cell ' + (c.future ? 'future' : 'l' + level(c.count))}
              title={c.future ? '' : c.count + (c.count === 1 ? ' activity on ' : ' activities on ') + c.key}
            />
          ))}
        </div>
      </div>
      <div className="legend">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span key={l} className={'cell l' + l} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
