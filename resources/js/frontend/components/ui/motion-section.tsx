import { motion, type HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';

type MotionSectionProps = HTMLMotionProps<'section'> & {
  delay?: number;
};

export function MotionSection({ className, children, delay = 0, ...props }: MotionSectionProps) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function StaggerContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={
        reduced
          ? undefined
          : {
              hidden: {},
              show: { transition: { staggerChildren: 0.1 } },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      variants={
        reduced
          ? undefined
          : {
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}
