'use client';

import { motion } from 'framer-motion';

const features = [
    {
        title: "AI Job Agent",
        description: "Works quietly in the background while you write code or live your life. Submits highly-tailored applications at scale.",
        delay: 0
    },
    {
        title: "AI Interview Buddy",
        description: "Listens in real time and suggests what to say next. Straight from your phone. Crush every interview.",
        delay: 0.1
    },
    {
        title: "AI LinkedIn Bot",
        description: "Automate your job applications while protecting your privacy. LinkedIn-compliant and fully secure.",
        delay: 0.2
    },
    {
        title: "AI Cover Letter Generator",
        description: "Generates pixel-perfect, context-aware cover letters that actually sound like you and highlight your exact relevant stack.",
        delay: 0.3
    }
];

export default function FeatureGrid() {
    return (
        <section className="relative py-32 px-6 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-4 drop-shadow-md">
                        A complete ecosystem for your job hunt
                    </h2>
                    <p className="text-neutral-400 text-[16px] md:text-lg font-medium leading-relaxed drop-shadow-md">
                        Everything you need to organize, execute, and analyze your job search in one unified platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: feature.delay, ease: "easeOut" }}
                            className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 flex flex-col gap-4 shadow-xl hover:bg-white/10 transition-colors"
                        >
                            <h4 className="text-white text-xl font-semibold tracking-tight">
                                {feature.title}
                            </h4>
                            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
