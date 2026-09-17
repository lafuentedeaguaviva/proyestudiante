import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

const StepperFases = ({ totalPasos, pasoActual, isStepUnlocked, onStepClick, customIcons }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexWrap: 'wrap',
      padding: '0.75rem 1.5rem',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderRadius: '2.5rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      margin: '0 auto',
      width: 'fit-content',
      maxWidth: '100%'
    }}>
      {Array.from({ length: totalPasos }).map((_, idx) => {
        const num = idx + 1;
        const isCurrent = num === pasoActual;
        const isPast = num < pasoActual;
        const unlocked = isStepUnlocked(num);
        
        let bgColor = 'rgba(248, 250, 252, 0.6)'; // locked
        let borderColor = '#f1f5f9';
        let textColor = '#cbd5e1';
        let shadow = 'none';

        if (isCurrent) {
          bgColor = '#3b82f6';
          borderColor = '#3b82f6';
          textColor = 'white';
          shadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
        } else if (isPast) {
          bgColor = '#10b981';
          borderColor = '#10b981';
          textColor = 'white';
          shadow = '0 4px 12px rgba(16, 185, 129, 0.25)';
        } else if (unlocked) {
          bgColor = 'white';
          borderColor = '#cbd5e1';
          textColor = '#64748b';
        }

        const iconToRender = customIcons && customIcons[idx] ? customIcons[idx] : num;

        return (
          <React.Fragment key={num}>
            <motion.button
              disabled={!unlocked}
              onClick={() => onStepClick(num)}
              title={unlocked ? `Ir al paso ${num}` : `Paso ${num} bloqueado`}
              initial={false}
              animate={{
                backgroundColor: bgColor,
                borderColor: borderColor,
                color: textColor,
                boxShadow: shadow,
                scale: isCurrent ? 1.15 : 1
              }}
              whileHover={unlocked && !isCurrent ? { scale: 1.1, borderColor: '#94a3b8' } : {}}
              whileTap={unlocked && !isCurrent ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                padding: 0,
                outline: 'none',
                position: 'relative',
                zIndex: 2,
                opacity: unlocked ? 1 : 0.6,
                margin: '0.25rem 0'
              }}
            >
              {isPast ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Check size={22} strokeWidth={3} />
                </motion.div>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {iconToRender}
                </span>
              )}
            </motion.button>
            
            {num < totalPasos && (
              <div style={{
                width: '32px',
                height: '4px',
                background: '#f1f5f9',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden',
                margin: '0 4px'
              }}>
                <motion.div 
                  initial={false}
                  animate={{ width: isPast ? '100%' : '0%' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    background: '#10b981',
                    borderRadius: '2px'
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepperFases;
