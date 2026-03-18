import Link from 'next/link';

export default function Payment() {
  return (
    <div className="bg-slate-gray text-white font-sans min-h-screen flex flex-col pt-4">
      {/* Header */}
      <header className="p-6 flex items-center justify-between" data-purpose="screen-header">
        <Link href="/" aria-label="Go back" className="w-10 h-10 rounded-full flex items-center justify-center neu-surface active:shadow-neu-inset transition-all">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
        </Link>
        <h1 className="text-lg font-semibold flex-1 text-center pr-10">Choose your payment method</h1>
      </header>
      
      <main className="flex-1 px-6 space-y-10 overflow-y-auto pb-32">
        {/* Payment Methods Selector */}
        <section className="space-y-6" data-purpose="payment-selector">
          <div className="grid grid-cols-3 gap-4">
            {/* Credit Card (Active) */}
            <button className="aspect-square flex flex-col items-center justify-center rounded-2xl shadow-neu-inset p-2 border border-white/5 bg-slate-gray" data-purpose="method-credit-card">
              <div className="w-8 h-8 mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-mint-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-mint-green">Credit card</span>
            </button>
            {/* PayPal */}
            <button className="neu-surface aspect-square flex flex-col items-center justify-center rounded-2xl p-2 border border-white/5 active:shadow-neu-inset transition-all" data-purpose="method-paypal">
              <div className="w-8 h-8 mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 21h3.3c.6 0 1.2-.4 1.3-1l.9-5.7c0-.2.2-.3.4-.3h2.3c3.6 0 5.8-1.8 6.4-5.2.3-1.6.1-2.9-.7-3.8C19.7 4 18.1 3.5 16 3.5H7.5c-.7 0-1.2.5-1.3 1.2L3.3 19.3c-.1.7.4 1.2 1.1 1.2h2.6z"></path>
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">PayPal</span>
            </button>
            {/* Bank Transfer */}
            <button className="neu-surface aspect-square flex flex-col items-center justify-center rounded-2xl p-2 border border-white/5 active:shadow-neu-inset transition-all" data-purpose="method-bank">
              <div className="w-8 h-8 mb-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Bank Transfer</span>
            </button>
          </div>
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2" data-purpose="pagination-dots">
            <div className="w-2 h-2 rounded-full bg-mint-green shadow-[0_0_8px_#00F5D4]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
        </section>

        {/* Recurring Pill */}
        <section data-purpose="recurring-settings">
          <div className="w-full shadow-neu-inset rounded-full py-4 px-6 flex items-center justify-between border border-white/5 bg-slate-gray">
            <span className="text-sm text-gray-300 font-medium">Recurring billing, cancel any time</span>
            <button className="w-8 h-8 rounded-full shadow-[4px_4px_8px_#24242a,-4px_-4px_8px_#363640] flex items-center justify-center active:shadow-neu-inset bg-slate-gray">
              <svg className="w-4 h-4 text-mint-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              </svg>
            </button>
          </div>
        </section>

        {/* Saved Cards */}
        <section className="space-y-4" data-purpose="saved-cards">
          <h2 className="text-lg font-bold text-gray-200">Your saved cards</h2>
          {/* VISA Card */}
          <div className="rounded-3xl p-6 h-52 flex flex-col justify-between relative overflow-hidden border border-white/10" style={{background: 'linear-gradient(145deg, #303039, #292930)', boxShadow: '10px 10px 20px #24242a, -10px -10px 20px #363640'}} data-purpose="credit-card-ui">
            {/* Logo and Chip */}
            <div className="flex justify-between items-start">
              <div className="w-12 h-9 bg-yellow-500/20 rounded-md border border-yellow-500/30 flex flex-col justify-around p-1">
                <div className="h-[1px] bg-yellow-500/40 w-full"></div>
                <div className="h-[1px] bg-yellow-500/40 w-full"></div>
                <div className="h-[1px] bg-yellow-500/40 w-full"></div>
              </div>
              <div className="text-right">
                <span className="italic font-black text-2xl text-blue-400 opacity-80">VISA</span>
              </div>
            </div>
            {/* Card Number */}
            <div className="mt-4">
              <p className="text-xl tracking-[0.2em] font-mono text-gray-200">**** 2111</p>
            </div>
            {/* Card Footer */}
            <div className="flex justify-between items-end">
              <div>
                <svg className="w-6 h-6 text-gray-500 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-mint-green font-bold text-sm">In use ✓</span>
              </div>
            </div>
          </div>
          {/* Pagination for Cards */}
          <div className="flex justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-mint-green"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
          </div>
        </section>
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-slate-gray/95 backdrop-blur-md px-6 pt-4 pb-8 space-y-4 border-t border-white/5" data-purpose="checkout-footer">
        <div className="flex justify-center">
          <p className="text-gray-400 text-sm">
            Paying <span className="text-mint-green font-bold">$6.99/mo</span> + 20%VAT
          </p>
        </div>
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00F5D4] to-[#00D19F] text-slate-gray font-black text-lg shadow-[0_10px_30px_rgba(0,245,212,0.3)] hover:scale-[1.02] transition-transform" data-purpose="btn-continue">
          CONTINUE
        </button>
        <div className="flex justify-center items-center gap-6 opacity-40 grayscale" data-purpose="security-logos">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"></path>
            </svg>
            <span className="text-[10px] font-bold">PCI DSS</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"></path>
            </svg>
            <span className="text-[10px] font-bold uppercase">Norton Secured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
