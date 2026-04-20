import { useEffect } from 'react';
import { motion } from 'motion/react';
import { BrandMark } from '../components/layout';

export function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-5"
      >
        <BrandMark size={52} />
        <p className="text-sm text-text-muted">Smart commutes on designated routes.</p>
      </motion.div>

      <div className="absolute bottom-10 w-40 h-[2px] bg-ink-150 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-16 bg-brand-400"
        />
      </div>
    </div>
  );
}
