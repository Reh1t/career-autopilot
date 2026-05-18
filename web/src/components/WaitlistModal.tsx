'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

import { supabase } from '@/lib/supabase';

export default function WaitlistModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-waitlist', handleOpen);
        return () => window.removeEventListener('open-waitlist', handleOpen);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
                console.error('Supabase credentials missing. Check your .env.local file.');
                setStatus('error');
                return;
            }

            const { error } = await supabase
                .from('Waitlist')
                .insert([{
                    id: crypto.randomUUID(),
                    email
                }]);

            if (error) {
                // Handle unique constraint (e.g., email already exists)
                if (error.code === '23505') {
                    setStatus('success'); // Still show success if they're already on it
                } else {
                    throw error;
                }
            } else {
                setStatus('success');
            }

            setTimeout(() => {
                setIsOpen(false);
                setTimeout(() => {
                    setStatus('idle');
                    setEmail('');
                }, 500);
            }, 2000);
        } catch (err: any) {
            console.error('Waitlist error details:', {
                message: err.message,
                details: err.details,
                hint: err.hint,
                code: err.code,
                fullError: err
            });
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 z-[101] shadow-2xl"
                    >
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-accent/30 rounded-full blur-2xl pointer-events-none" />

                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h2>
                        <p className="text-neutral-400 mb-8 text-sm leading-relaxed">
                            We&apos;re letting people in gradually. Reserve your spot for early access to the automated job application platform.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'loading' || status === 'success'}
                                className="w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-neutral-200 transition-colors disabled:opacity-50 flex justify-center items-center"
                            >
                                {status === 'loading' ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                ) : status === 'success' ? (
                                    'Added to Waitlist!'
                                ) : (
                                    'Secure My Spot'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
