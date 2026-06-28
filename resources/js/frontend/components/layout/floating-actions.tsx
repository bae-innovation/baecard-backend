import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';

import { frontendAsset } from '@frontend/lib/brand';
import { useAppSettings } from '@/hooks/useAppSettings';

export function FloatingActions() {
  const app = useAppSettings();
  const phone = (app.support_phone ?? '+8801897543515').replace(/\s/g, '');
  const whatsapp = (app.whatsapp ?? '+8801897543515').replace(/\D/g, '');

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 hidden md:block">
      <div className="pointer-events-auto mx-auto max-w-7xl px-4 pb-6">
        <div className="flex justify-between">
          <motion.a
            href={`tel:${phone}`}
            className="fe-touch flex size-14 items-center justify-center rounded-full bg-fe-accent text-fe-bg shadow-lg shadow-fe-accent/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Call"
          >
            <Phone className="size-6" />
          </motion.a>
          <motion.a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="fe-touch flex size-14 items-center justify-center rounded-full bg-fe-accent text-fe-bg shadow-lg shadow-fe-accent/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="WhatsApp"
          >
            <img src={frontendAsset('socials/whatsapp.svg')} alt="" className="size-7" />
          </motion.a>
        </div>
      </div>
    </div>
  );
}
