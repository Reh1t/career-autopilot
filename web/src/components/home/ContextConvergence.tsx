'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ContextConvergence() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        // We track from when the top of the 300vh section hits the top of the viewport 
        // to when the bottom hits the bottom. This accurately tracks the "pinned" duration.
        offset: ["start start", "end end"]
    });

    // Animate everything based on scroll position!
    // Scale central hub: stays normal until icons reach it, then pulses
    const hubScale = useTransform(scrollYProgress, [0, 0.7, 0.85, 1], [1, 1, 1.15, 1]);
    const hubGlow = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]); // Opacity of the glowing ring

    // Phase 1 -> 3: Suction mapping for Peripheral Icons
    // They sit statically in their expanded positions from 0 to 0.1, then get sucked in.

    // Icon 1 (Top Left: Excel)
    const icon1X = useTransform(scrollYProgress, [0, 0.1, 0.6], [-300, -300, 0]);
    const icon1Y = useTransform(scrollYProgress, [0, 0.1, 0.6], [-200, -200, 0]);
    const icon1Scale = useTransform(scrollYProgress, [0, 0.5, 0.6], [1, 1, 0]);
    const icon1Opacity = useTransform(scrollYProgress, [0, 0.5, 0.6], [1, 1, 0]);

    // Icon 2 (Top Right: Workday)
    const icon2X = useTransform(scrollYProgress, [0, 0.15, 0.65], [300, 300, 0]);
    const icon2Y = useTransform(scrollYProgress, [0, 0.15, 0.65], [-150, -150, 0]);
    const icon2Scale = useTransform(scrollYProgress, [0, 0.55, 0.65], [1, 1, 0]);
    const icon2Opacity = useTransform(scrollYProgress, [0, 0.55, 0.65], [1, 1, 0]);

    // Icon 3 (Bottom Left: LinkedIn)
    const icon3X = useTransform(scrollYProgress, [0, 0.05, 0.55], [-250, -250, 0]);
    const icon3Y = useTransform(scrollYProgress, [0, 0.05, 0.55], [200, 200, 0]);
    const icon3Scale = useTransform(scrollYProgress, [0, 0.45, 0.55], [1, 1, 0]);
    const icon3Opacity = useTransform(scrollYProgress, [0, 0.45, 0.55], [1, 1, 0]);

    // Icon 4 (Bottom Right: PDF/Resume)
    const icon4X = useTransform(scrollYProgress, [0, 0.2, 0.7], [250, 250, 0]);
    const icon4Y = useTransform(scrollYProgress, [0, 0.2, 0.7], [180, 180, 0]);
    const icon4Scale = useTransform(scrollYProgress, [0, 0.6, 0.7], [1, 1, 0]);
    const icon4Opacity = useTransform(scrollYProgress, [0, 0.6, 0.7], [1, 1, 0]);

    // Icon 5 (Far Left Middle: Greenhouse)
    const icon5X = useTransform(scrollYProgress, [0, 0.25, 0.75], [-350, -350, 0]);
    const icon5Y = useTransform(scrollYProgress, [0, 0.25, 0.75], [50, 50, 0]);
    const icon5Scale = useTransform(scrollYProgress, [0, 0.65, 0.75], [1, 1, 0]);
    const icon5Opacity = useTransform(scrollYProgress, [0, 0.65, 0.75], [1, 1, 0]);

    // Final Output Text: Appears only after all icons are sucked in (0.75 -> 0.85)
    const finalOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
    const finalY = useTransform(scrollYProgress, [0.75, 0.85], [20, 0]);

    return (
        // Height 300vh allows for plenty of scrolling while pinned
        <section ref={containerRef} className="relative h-[300vh]">

            {/* Sticky Container - Pins just below navbar when scrolled to */}
            <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full flex flex-col items-center justify-start pt-8 overflow-hidden pb-12">

                {/* Header Text - No animation, just scrolls up and sticks */}
                <div className="w-full text-center max-w-3xl px-6 z-20 flex flex-col items-center gap-4 shrink-0">
                    <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight drop-shadow-md">
                        True Automation Means Zero Data Entry
                    </h2>
                    <p className="text-neutral-400 text-[16px] md:text-lg font-medium leading-relaxed drop-shadow-md max-w-2xl">
                        Spreadsheets take hours to maintain. Autofill extensions still force you to click through endless application portals. Manual applying leaves you shouting into a void. AutoApplier handles the entire loop.
                    </p>
                </div>

                {/* Animation Canvas - Shrinks exactly to the remaining space safely within the bounds of the viewport */}
                <div className="relative w-full max-w-4xl flex-1 flex items-center justify-center mt-8">

                    {/* The Background Glow behind the central hub that activates at the end */}
                    <motion.div
                        style={{ opacity: hubGlow, scale: hubScale }}
                        className="absolute inset-0 m-auto w-64 h-64 bg-[radial-gradient(circle,rgba(73,92,82,0.4)_0%,transparent_70%)] rounded-full blur-2xl z-0"
                    />

                    {/* The Central AutoApplier Hub */}
                    <motion.div
                        style={{ scale: hubScale }}
                        className="absolute inset-0 m-auto w-24 h-24 bg-[#0a0a0a] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(73,92,82,0.5)] z-20 flex items-center justify-center"
                    >
                        {/* AutoApplier Logo representation */}
                        {/* Pulse Icon matching the new background colour context */}
                        <div className="w-12 h-12 bg-white rounded-xl border-[4px] border-[#060907] relative">
                            <div className="absolute inset-1 bg-[#0a0a0a] rounded-lg"></div>
                        </div>
                    </motion.div>

                    {/* Peripheral Chaos Icons */}

                    {/* 1. Excel */}
                    <motion.div
                        style={{ x: icon1X, y: icon1Y, scale: icon1Scale, opacity: icon1Opacity }}
                        className="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 bg-[#107c41] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 z-10"
                    >
                        <span className="text-white font-bold text-xl">X</span>
                    </motion.div>

                    {/* 2. Workday */}
                    <motion.div
                        style={{ x: icon2X, y: icon2Y, scale: icon2Scale, opacity: icon2Opacity }}
                        className="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white/10 z-10"
                    >
                        <span className="text-[#005cb9] font-black text-xl italic mt-1">w</span>
                    </motion.div>

                    {/* 3. LinkedIn */}
                    <motion.div
                        style={{ x: icon3X, y: icon3Y, scale: icon3Scale, opacity: icon3Opacity }}
                        className="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 bg-[#0a66c2] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 z-10"
                    >
                        <span className="text-white font-bold text-xl">in</span>
                    </motion.div>

                    {/* 4. PDF / Resume */}
                    <motion.div
                        style={{ x: icon4X, y: icon4Y, scale: icon4Scale, opacity: icon4Opacity }}
                        className="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 bg-[#e81919] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 z-10"
                    >
                        <span className="text-white font-bold text-[12px]">PDF</span>
                    </motion.div>

                    {/* 5. Greenhouse */}
                    <motion.div
                        style={{ x: icon5X, y: icon5Y, scale: icon5Scale, opacity: icon5Opacity }}
                        className="absolute top-1/2 left-1/2 w-14 h-14 -ml-7 -mt-7 bg-[#00a651] rounded-2xl flex items-center justify-center shadow-lg border border-white/10 z-10"
                    >
                        <span className="text-white font-serif text-2xl lowercase mt-[-4px]">g</span>
                    </motion.div>

                    {/* Final Metrics Pop (Appears directly under the hub at the end) */}
                    <motion.div
                        style={{
                            opacity: finalOpacity,
                            y: finalY
                        }}
                        className="absolute bottom-8 md:bottom-16 px-6 py-3 bg-[#a0cfae]/10 border border-[#a0cfae]/30 rounded-full backdrop-blur-md z-30"
                    >
                        <span className="text-[#a0cfae] font-medium text-sm md:text-base">
                            7 Hours of Manual Work ➔ <span className="text-white">5 Minutes of AI Setup</span>
                        </span>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
