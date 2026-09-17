import React from 'react';
import { motion } from 'framer-motion';

const MundoCard = ({ mundo, onClick, delayIdx = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delayIdx * 0.1 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: 'var(--shadow-hover)'
      }}
      onClick={() => onClick(mundo.id)}
      style={{
        background: 'var(--color-surface)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--color-border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-2xl) var(--spacing-xl)',
        cursor: 'pointer',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: mundo.color }} />
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delayIdx * 0.2 }}
        style={{
          color: mundo.color,
          marginBottom: 'var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'center',
          filter: `drop-shadow(0 0 15px ${mundo.color}80)`
        }}
      >
        {mundo.icon}
      </motion.div>
      <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)', margin: '0 0 var(--spacing-md) 0' }}>
        {mundo.rol}
      </h3>
      <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, margin: 0 }}>
        {mundo.desc}
      </p>
    </motion.div>
  );
};

export default MundoCard;
