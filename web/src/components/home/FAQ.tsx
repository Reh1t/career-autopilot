'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "How does the AI Job Agent actually apply for me?",
        answer: "Our agent uses advanced browser automation to navigate job portals exactly like a human would. It fills out forms using the profile you create, strictly following your approved job preferences, location settings, and salary requirements. You will see every application it submits in your tracking dashboard."
    },
    {
        question: "Will employers know I am using an AI to apply?",
        answer: "No. The system generates unique, context-aware cover letters tailored to each specific job description, and the applications are submitted using human-like pacing and direct integrations where possible. It looks identical to a high-effort manual application."
    },
    {
        question: "Can I review applications before they are sent?",
        answer: "Yes! You can toggle between 'Fully Autonomous' mode and 'Approve First' mode at any time. In Approve First mode, the AI finds matches and drafts the application, but waits for your final click before submitting."
    },
    {
        question: "What platforms does AutoApplier support?",
        answer: "We currently support one-click automation for Workday, Greenhouse, Lever, and standard LinkedIn Easy Apply roles. We are constantly expanding our integrations."
    },
    {
        question: "Is my data and resume secure?",
        answer: "Absolutely. We never sell your data. Your resume and personal information are encrypted and used solely for the purpose of submitting your job applications."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative py-32 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-4 drop-shadow-md">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-neutral-400 text-[16px] md:text-lg font-medium leading-relaxed drop-shadow-md">
                        Everything you need to know about the product and how it works.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border border-white/10 rounded-2xl bg-[#060907]/60 backdrop-blur-sm overflow-hidden transition-colors hover:border-white/20"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                                >
                                    <span className="text-white font-medium text-lg pr-4">{faq.question}</span>
                                    <span className="text-neutral-400 flex-shrink-0">
                                        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                    </span>
                                </button>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 text-neutral-400 text-base leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
