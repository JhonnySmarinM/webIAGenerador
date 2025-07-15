import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Card({ title, description, children, footer }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md w-full max-w-3xl overflow-hidden"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
        {description && (
          <p className="text-gray-500 dark:text-gray-300 mb-6">{description}</p>
        )}
        <div className="mt-4">{children}</div>
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
          {footer}
        </div>
      )}
    </motion.div>
  );
}
