import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
  { href: '/admin/calendar', label: 'Calendar', icon: '📅' },
  { href: '/admin/products', label: 'Products', icon: '🎂' },
  { href: '/admin/occasions', label: 'Occasions', icon: '✨' }, // 👈 Add this
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream md:flex">
      {/* Sidebar (Desktop) / Bottom Bar (Mobile) */}
      <aside className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-olive p-2 text-cream md:sticky md:top-0 md:h-screen md:w-64 md:flex-col md:justify-start md:gap-2 md:p-4 print:hidden">
        <div className="hidden md:block mb-6 px-2">
          <h2 className="font-display text-xl">Admin Panel</h2>
          <p className="text-xs text-cream/70">Cakes by Aspeya</p>
        </div>
        
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center rounded-lg p-2 text-xs hover:bg-cream/10 md:flex-row md:justify-start md:gap-3 md:p-3 md:text-sm"
          >
            <span className="text-xl md:text-base">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </aside>

      {/* Main Content Area */}
       <main className="flex-1 p-4 pb-24 md:p-8 md:pb-8 print:p-0">
        {children}
      </main>
    </div>
  );
}