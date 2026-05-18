import Hero from '@/components/home/Hero';
import AppDemo from '@/components/home/AppDemo';
import ContextConvergence from '@/components/home/ContextConvergence';
import FeatureGrid from '@/components/home/FeatureGrid';
import FAQ from '@/components/home/FAQ';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AppDemo />
      <ContextConvergence />
      <FeatureGrid />
      <FAQ />
      <CTA />
    </main>
  );
}
