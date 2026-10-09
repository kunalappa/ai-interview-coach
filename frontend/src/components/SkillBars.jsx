const NAMES = {
  communication: 'Communication',
  technical: 'Technical knowledge',
  problemSolving: 'Problem solving',
  structure: 'Answer structure',
};

export default function SkillBars({ skills }) {
  return (
    <div className="bars">
      {Object.keys(NAMES).map((k) => (
        <div className="bar-row" key={k}>
          <div className="bar-top">
            <span>{NAMES[k]}</span>
            <span>{skills[k]}</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: skills[k] + '%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
