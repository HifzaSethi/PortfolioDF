import { DF_VALUE_LIST } from '../../data/values';

interface ValueListProps {
  title?: string;
}

export function ValueList({ title = 'The DF. Value' }: ValueListProps) {
  return (
    <div className="border-t border-[var(--border-light-strong)] pt-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--magenta)]">
            Commercial Outcomes
          </p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--near-black)]">
            {title}
          </h3>
        </div>

        <ol className="lg:col-span-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {DF_VALUE_LIST.map((item, idx) => (
            <li
              key={item}
              className="border-b border-[var(--border-light)] pb-3 flex items-baseline gap-3"
            >
              <span className="text-xs font-bold tabular-nums text-[var(--electric-blue)]">
                0{idx + 1}
              </span>
              <span className="text-sm font-semibold text-[var(--near-black)]">{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
