export function StepIndicator({ step }: { step: 1 | 2 }) {
  const steps = ['Choose Items', 'Delivery Info'];
  
  return (
    <ol className="flex items-center justify-center gap-3 md:gap-6 mb-8">
      {steps.map((label, i) => {
        const num = (i + 1) as 1 | 2;
        const active = num === step;
        const done = num < step;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                done
                  ? 'bg-olive text-cream'
                  : active
                  ? 'bg-burgundy text-cream'
                  : 'bg-cream-dark text-olive-dark'
              }`}
            >
              {done ? '✓' : num}
            </span>
            <span className={`text-sm ${active ? 'text-ink font-medium' : 'text-olive-dark'}`}>
              {label}
            </span>
            {i < steps.length - 1 && <span className="mx-2 h-px w-8 bg-olive/30" />}
          </li>
        );
      })}
    </ol>
  );
}
