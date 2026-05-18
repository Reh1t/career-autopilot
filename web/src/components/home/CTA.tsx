'use client';

import { useState } from 'react';
import WaitlistModal from '@/components/home/WaitlistModal';

export default function CTA() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative py-32 px-6 overflow-hidden">

            <div className="max-w-4xl mx-auto relative z-10 font-serif text-center flex flex-col items-center">
                <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
                    Ready to completely automate your job hunt?
                </h2>
                <p className="text-neutral-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl">
                    Stop filling out forms and start taking interviews. Join the waitlist for the only zero-touch job search ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-8 font-medium text-black focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#060907]"
                    >
                        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#a0cfae] via-green-400 to-[#a0cfae] opacity-0 blur transition duration-500 group-hover:opacity-30"></span>
                        <span className="relative font-bold text-[16px] tracking-wide">
                            Join the Waitlist
                        </span>
                    </button>

                    <WaitlistModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                </div>
            </div>
        </section>
    );
}
