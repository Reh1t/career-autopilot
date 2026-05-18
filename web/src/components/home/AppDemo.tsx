'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function AppDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // 5-Phase Mapping for Opacity (Left Column Text)
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.2], [1, 1, 0, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [0, 1, 1, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [0, 1, 1, 0]);
    const opacity5 = useTransform(scrollYProgress, [0.75, 0.8, 1, 1], [0, 1, 1, 1]);

    // 5-Phase Mapping for Visuals (Right Column)
    const visualOpacity1 = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.2], [1, 1, 0, 0]);
    const visualOpacity2 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0, 1, 1, 0]);
    const visualOpacity3 = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [0, 1, 1, 0]);
    const visualOpacity4 = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [0, 1, 1, 0]);
    const visualOpacity5 = useTransform(scrollYProgress, [0.75, 0.8, 1, 1], [0, 1, 1, 1]);

    // 3D Scale mapping
    const scale1 = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 0.8, 0.8]);
    const scale2 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [0.8, 1, 1, 0.8]);
    const scale3 = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [0.8, 1, 1, 0.8]);
    const scale4 = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [0.8, 1, 1, 0.8]);
    const scale5 = useTransform(scrollYProgress, [0.75, 0.8, 1, 1], [0.8, 1, 1, 1]);

    // Y-Translation mapping
    const visualY1 = useTransform(scrollYProgress, [0, 0.15, 0.2], [0, -20, -20]);
    const visualY2 = useTransform(scrollYProgress, [0.15, 0.2, 0.35, 0.4], [20, 0, 0, -20]);
    const visualY3 = useTransform(scrollYProgress, [0.35, 0.4, 0.55, 0.6], [20, 0, 0, -20]);
    const visualY4 = useTransform(scrollYProgress, [0.55, 0.6, 0.75, 0.8], [20, 0, 0, -20]);
    const visualY5 = useTransform(scrollYProgress, [0.75, 0.8, 1, 1], [20, 0, 0, 0]);

    return (
        <section ref={containerRef} id="app-demo" className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(36,63,48,0.1)_0%,transparent_100%)] -z-10" />

            {/* Fogs to mask text scrolling off-screen */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-30">
                <div className="sticky top-0 w-full flex flex-col justify-end pb-6" style={{ height: '180px' }}>
                    <div className="max-w-7xl mx-auto px-6 w-full flex justify-center text-center">
                        <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
                            How AutoApplier Works
                        </h3>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-6 relative z-10 pt-[50px]">
                {/* Left Column Text */}
                <div className="w-full md:w-1/2 flex flex-col z-10 pb-[20vh] pt-[15vh]">

                    {/* Step 1 */}
                    <div className="min-h-[80vh] flex flex-col justify-center">
                        <motion.div style={{ opacity: opacity1 }} className="space-y-4 pr-0 md:pr-12">
                            <div className="text-white md:text-[#a0cfae] text-sm font-bold tracking-widest uppercase">1. Master Profile</div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">Set your parameters once</h2>
                            <p className="text-neutral-400 text-[16px] md:text-[18px] leading-relaxed font-medium">
                                Fill in your work history, define your tech stack, and set strict preferences for salary, remote status, and location. This master context is all the AI needs.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 2 */}
                    <div className="min-h-[80vh] flex flex-col justify-center">
                        <motion.div style={{ opacity: opacity2 }} className="space-y-4 pr-0 md:pr-12">
                            <div className="text-white md:text-[#a0cfae] text-sm font-bold tracking-widest uppercase">2. Intelligent Sourcing</div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">Find the roles you actually want</h2>
                            <p className="text-neutral-400 text-[16px] md:text-[18px] leading-relaxed font-medium">
                                Our engine continuously scans boards and company sites, filtering out ghost jobs and bad fits to curate a high-quality pipeline compatible with your exact profile.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 3 */}
                    <div className="min-h-[80vh] flex flex-col justify-center">
                        <motion.div style={{ opacity: opacity3 }} className="space-y-4 pr-0 md:pr-12">
                            <div className="text-white md:text-[#a0cfae] text-sm font-bold tracking-widest uppercase">3. Dynamic Resumes</div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">Bypass the ATS every time</h2>
                            <p className="text-neutral-400 text-[16px] md:text-[18px] leading-relaxed font-medium">
                                For every matched job, the AI rebuilds your resume on the fly. It injects relevant keywords from the specific job description to maximize your ATS pass rate.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 4 */}
                    <div className="min-h-[80vh] flex flex-col justify-center">
                        <motion.div style={{ opacity: opacity4 }} className="space-y-4 pr-0 md:pr-12">
                            <div className="text-white md:text-[#a0cfae] text-sm font-bold tracking-widest uppercase">4. Autonomous Application</div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">The zero-touch submission</h2>
                            <p className="text-neutral-400 text-[16px] md:text-[18px] leading-relaxed font-medium">
                                The agent navigates complex portals (Workday, Greenhouse, etc.) exactly like a human. It answers custom questionnaire inputs dynamically based on your master profile.
                            </p>
                        </motion.div>
                    </div>

                    {/* Step 5 */}
                    <div className="min-h-[80vh] flex flex-col justify-center">
                        <motion.div style={{ opacity: opacity5 }} className="space-y-4 pr-0 md:pr-12">
                            <div className="text-white md:text-[#a0cfae] text-sm font-bold tracking-widest uppercase">5. Command Center</div>
                            <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight leading-[1.1]">Never lose track of a prospect</h2>
                            <p className="text-neutral-400 text-[16px] md:text-[18px] leading-relaxed font-medium">
                                A clean, unified dashboard tracking exactly where you applied, the status of the application, and the tailored resume variant that was sent.
                            </p>
                        </motion.div>
                    </div>

                </div>

                {/* Right Column Visuals */}
                <div className="hidden md:flex w-1/2 h-screen sticky top-0 items-center justify-center pt-[150px]">

                    {/* Visual 1: Profile/Parameters */}
                    <motion.div style={{ opacity: visualOpacity1, y: visualY1, scale: scale1 }} className="absolute w-[80%] aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col gap-5 shadow-2xl">
                        <div className="w-1/3 h-6 bg-white text-black font-semibold text-xs flex items-center px-3 rounded-md">Master Profile</div>
                        <div className="flex gap-4 mt-2">
                            <div className="w-12 h-12 bg-white/10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="w-3/4 h-4 bg-white/20 rounded-md" />
                                <div className="w-1/2 h-4 bg-white/10 rounded-md" />
                            </div>
                        </div>
                        <div className="space-y-3 mt-4">
                            <div className="flex justify-between items-center"><div className="w-1/4 h-3 bg-white/10 rounded-sm" /><div className="w-1/2 h-3 bg-green-500/20 rounded-sm" /></div>
                            <div className="flex justify-between items-center"><div className="w-1/3 h-3 bg-white/10 rounded-sm" /><div className="w-1/3 h-3 bg-[#a0cfae]/30 rounded-sm" /></div>
                        </div>
                    </motion.div>

                    {/* Visual 2: Radar/Sourcing */}
                    <motion.div style={{ opacity: visualOpacity2, y: visualY2, scale: scale2 }} className="absolute w-[80%] aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border border-[#a0cfae]/20 rounded-full animate-ping" />
                            <div className="absolute w-32 h-32 border border-[#a0cfae]/40 rounded-full" />
                            <div className="absolute w-16 h-16 border border-[#a0cfae]/60 rounded-full bg-[#a0cfae]/10" />
                        </div>
                        <div className="z-10 bg-black/50 backdrop-blur-md border border-white/10 p-3 rounded-lg text-xs text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Scanning 421 Remote Roles...
                        </div>
                    </motion.div>

                    {/* Visual 3: Resume Generation */}
                    <motion.div style={{ opacity: visualOpacity3, y: visualY3, scale: scale3 }} className="absolute w-[80%] aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 flex flex-col gap-4 shadow-2xl">
                        <div className="flex justify-between">
                            <div className="w-1/3 h-6 bg-white/10 rounded-md" />
                            <div className="w-1/4 h-6 bg-[#a0cfae]/20 text-[#a0cfae] text-[10px] flex items-center justify-center rounded-md font-bold">ATS OPTIMIZED</div>
                        </div>
                        <div className="w-full h-4 bg-white/5 rounded-md mt-4" />
                        <div className="w-[90%] h-4 bg-[#a0cfae]/30 rounded-md shadow-[0_0_10px_rgba(160,207,174,0.2)]" />
                        <div className="w-[95%] h-4 bg-white/5 rounded-md" />
                        <div className="w-1/2 h-4 bg-white/20 rounded-md mt-4" />
                        <div className="w-[85%] h-4 bg-[#a0cfae]/30 rounded-md shadow-[0_0_10px_rgba(160,207,174,0.2)]" />
                    </motion.div>

                    {/* Visual 4: Auto-Apply Terminal */}
                    <motion.div style={{ opacity: visualOpacity4, y: visualY4, scale: scale4 }} className="absolute w-[80%] aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl font-mono text-sm">
                        <div className="flex gap-2 mb-6">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <div className="space-y-3 text-neutral-400">
                            <p className="text-white/70">{'>'} Bypassing Captcha...</p>
                            <p>{'>'} Entering Workday portal...</p>
                            <p>{'>'} Uploading optimized_resume.pdf</p>
                            <p>{'>'} Answering custom employer questions...</p>
                            <p className="text-[#a0cfae] font-bold animate-pulse">{'>'} Application Submitted Successfully.</p>
                        </div>
                    </motion.div>

                    {/* Visual 5: Tracking Dashboard */}
                    <motion.div style={{ opacity: visualOpacity5, y: visualY5, scale: scale5 }} className="absolute w-[80%] aspect-square bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                        <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-4">
                            <div className="font-semibold text-white">Application Pipeline</div>
                            <div className="text-xs bg-white/10 px-3 py-1 rounded-full text-white/70">12 Sent Today</div>
                        </div>
                        {[
                            { company: "Vercel", role: "Frontend Dev", status: "Applied", color: "text-blue-400" },
                            { company: "Stripe", role: "Software Engineer", status: "Interview", color: "text-green-400" },
                            { company: "Supabase", role: "React Engineer", status: "Applied", color: "text-blue-400" },
                            { company: "Linear", role: "Product Engineer", status: "Applying...", color: "text-white/70 animate-pulse" },
                        ].map((row, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                <div>
                                    <div className="text-sm text-white font-medium">{row.company}</div>
                                    <div className="text-xs text-neutral-500">{row.role}</div>
                                </div>
                                <div className={`text-xs font-semibold ${row.color}`}>{row.status}</div>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
