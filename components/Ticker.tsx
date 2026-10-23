const items = [
  "C#",
  ".NET",
  "ASP.NET Core",
  "Entity Framework",
  "PostgreSQL",
  "React",
  "Next.js",
  "TypeScript",
  "Laravel",
  "Tailwind CSS",
  "Docker",
  "Cornerstone3D",
  "Python",
  "KrakenD",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-10 pr-10"
    >
      {items.map((item) => (
        <span key={item} className="flex shrink-0 items-center gap-10">
          <span className="readout text-xs whitespace-nowrap text-ink-soft">
            {item}
          </span>
          <span aria-hidden="true" className="text-[9px] text-signal">
            ◆
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Ticker() {
  return (
    <section
      aria-label="Teknologi yang dikuasai"
      className="ticker mask-fade-x mt-14 overflow-hidden border-y border-rule bg-paper-deep/70 py-3.5"
    >
      <div className="ticker-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
