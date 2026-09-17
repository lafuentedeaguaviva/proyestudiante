import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Cargando datos...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] gap-6 ${className}`}>
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-slate-700/30 border-t-blue-500 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-slate-700/30 border-b-indigo-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, yoyo: Infinity }}
        className="text-slate-400 font-medium tracking-wider text-sm uppercase"
      >
        {text}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;
