export function FloatingWhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8801519409555';
  const text = encodeURIComponent('Hi Cakes by Aspeya — I would like to place an order.');
  const href = `https://wa.me/${phone}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Cakes by Aspeya on WhatsApp"
      className="fixed bottom-5 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.18)] ring-1 ring-[var(--color-border)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.22)] md:bottom-6 md:right-6"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-whatsapp)] text-white">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M20.5 3.5A11.9 11.9 0 0 0 12 0C5.4 0 0 5.4 0 12a11.9 11.9 0 0 0 1.6 6L0 24l6.2-1.6A11.9 11.9 0 0 0 12 24c6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.5ZM12 22c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-3.7 1 .98-3.6-.25-.4A10 10 0 1 1 12 22Zm5.5-7.5c-.3-.15-1.8-.9-2-.95-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.67-2.1-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.2 3.08c.15.2 2.1 3.2 5.07 4.47.7.3 1.26.49 1.7.63.7.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </span>
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}