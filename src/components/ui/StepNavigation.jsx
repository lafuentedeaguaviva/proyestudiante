import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const StepNavigation = ({ onAnterior, onSiguiente, onFinalizar, step, totalSteps, nextText = 'Continuar' }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-6 pt-8 border-t border-slate-700/50">
      {onAnterior ? (
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAnterior}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <ArrowLeft size={20} />
          <span>Atrás</span>
        </motion.button>
      ) : (
        <div /> // Spacer
      )}

      {onSiguiente || onFinalizar ? (
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={step < totalSteps && onSiguiente ? onSiguiente : onFinalizar}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 transition-all border border-blue-500/30"
        >
          <span>{step < totalSteps ? nextText : 'Finalizar Fase'}</span>
          <CheckCircle size={22} className={step < totalSteps ? "" : "text-green-300"} />
        </motion.button>
      ) : null}
    </div>
  );
};

export default StepNavigation;
