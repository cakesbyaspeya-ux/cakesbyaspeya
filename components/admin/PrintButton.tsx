'use client';

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-full bg-burgundy px-6 py-2.5 text-sm font-medium text-cream shadow hover:bg-burgundy-dark transition print:hidden"
    >
      🖨️ Print Receipt
    </button>
  );
}