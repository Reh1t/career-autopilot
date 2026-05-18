import Link from 'next/link';

function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
        </svg>
    );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-transparent mt-24">
            <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 group mb-4">
                            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center transition-transform group-hover:scale-105">
                                <div className="w-4 h-4 bg-neutral-400 rounded-sm" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white/90">AutoApplier</span>
                        </Link>
                        <p className="text-sm text-neutral-500 max-w-sm leading-relaxed mb-6">
                            Your entire job search workflow on autopilot. Let AI handle the applications while you focus on the interviews.
                        </p>
                        {/* Social Media Links */}
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all">
                                <XIcon className="w-4 h-4" />
                                <span className="sr-only">X (Twitter)</span>
                            </Link>
                            <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all">
                                <InstagramIcon className="w-4 h-4" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all">
                                <TikTokIcon className="w-4 h-4" />
                                <span className="sr-only">TikTok</span>
                            </Link>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-[13px] font-semibold tracking-wider text-white uppercase mb-4">Product</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#changelog" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    Changelog
                                </Link>
                            </li>
                            <li>
                                <Link href="#pricing" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#businesses" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    Businesses
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="text-[13px] font-semibold tracking-wider text-white uppercase mb-4">Help</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#support" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link href="#faqs" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    FAQs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-[13px] font-semibold tracking-wider text-white uppercase mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/privacy" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-neutral-500">
                        &copy; {currentYear} AutoApplier. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-neutral-500">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
