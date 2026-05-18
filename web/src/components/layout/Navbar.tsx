'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <div className={`fixed top-0 left-0 w-full z-50 flex justify-center transition-all duration-500 ${isScrolled ? 'pt-4 md:pt-6' : 'pt-0'}`}>
            <motion.header
                className={`flex items-center justify-between transition-all duration-500 ${isScrolled
                    ? 'bg-white text-black rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-4 md:px-6 h-14 w-[95%] max-w-4xl border border-neutral-200/50'
                    : 'bg-transparent text-white px-6 w-full max-w-7xl h-20'
                    }`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Logo / Brand */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${isScrolled ? 'bg-[#060907]' : 'bg-white'
                        }`}>
                        <div className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm ${isScrolled ? 'bg-white' : 'bg-[#060907]'
                            }`} />
                    </div>
                    <span className={`font-bold text-lg md:text-xl tracking-tight transition-colors ${isScrolled ? 'text-black' : 'text-white'
                        }`}>
                        AutoApplier
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-semibold tracking-wide">
                    <Link href="/dashboard" className={`transition-colors ${isScrolled ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}>Dashboard</Link>
                    <Link href="/profile" className={`transition-colors ${isScrolled ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}>Profile</Link>
                    <Link href="#pricing" className={`transition-colors ${isScrolled ? 'text-neutral-500 hover:text-black' : 'text-neutral-400 hover:text-white'}`}>Pricing</Link>
                </nav>

                {/* CTA Actions */}
                <div className="flex items-center gap-3 lg:gap-5 shrink-0">
                    {!isScrolled && (
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-waitlist'))}
                            className="hidden md:block text-[13px] font-semibold tracking-wide text-neutral-400 hover:text-white transition-colors"
                        >
                            Log In
                        </button>
                    )}
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-waitlist'))}
                        className={`text-[12px] md:text-[13px] font-semibold tracking-wide px-4 py-1.5 md:py-2 rounded-xl hover:scale-105 transition-all ${isScrolled ? 'bg-[#1a231c] text-white hover:bg-[#060907]' : 'bg-white text-black hover:bg-neutral-200'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>
            </motion.header>
        </div>
    );
}
