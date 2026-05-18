'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#060907] border border-white/10 rounded-3xl p-8 w-full max-w-lg relative shadow-[0_0_50px_rgba(73,110,88,0.2)]"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-8 mt-2">
                                <h3 className="text-2xl font-serif text-white tracking-tight mb-2">
                                    Join the AutoApplier Beta
                                </h3>
                                <p className="text-neutral-400 text-sm">
                                    Spots are limited. Enter your email to secure early access.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="name@email.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#a0cfae] transition-colors backdrop-blur-sm"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-white text-black font-medium rounded-xl px-4 py-3 hover:bg-neutral-200 transition-colors"
                                >
                                    Get Early Access
                                </button>
                            </form>

                            <p className="text-center text-neutral-600 text-xs mt-6">
                                By joining the waitlist, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
