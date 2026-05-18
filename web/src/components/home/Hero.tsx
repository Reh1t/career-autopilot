'use client';

import { motion, Variants } from 'framer-motion';

export default function Hero() {
    // Staggered animation wrapper variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                ease: 'easeOut',
            },
        },
    };

    // Individual child animation variants
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden px-6 pt-32 pb-16">

            <motion.div
                className="max-w-3xl mx-auto text-center z-10"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-6xl md:text-7xl lg:text-[76px] font-serif text-white mb-6 md:mb-8 leading-[1.1] md:leading-[1.1] tracking-tight"
                >
                    Your Entire Job Search<br className="hidden md:block" /> Workflow On Autopilot
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-[16px] md:text-[18px] text-neutral-300 max-w-[580px] mx-auto mb-10 leading-relaxed font-medium"
                >
                    Let our AI handle your entire job search process while you focus on preparing for interviews. Automated applications, optimized resumes, and personalized cover letters.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col items-center gap-5">
                    <button onClick={() => window.dispatchEvent(new CustomEvent('open-waitlist'))} className="inline-block relative group">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-black font-semibold text-[15px] px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] cursor-pointer"
                        >
                            Get Early Access
                        </motion.div>
                    </button>
                    <p className="text-[12px] text-neutral-500 max-w-xs mx-auto">
                        We are open to the waitlist for now.
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
