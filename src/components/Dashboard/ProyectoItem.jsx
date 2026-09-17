import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Check, X, Trash2, ArrowRight } from 'lucide-react';

const ProyectoItem = ({
  proyecto,
  idx = 0,
  isEditing,
  editTitle,
  onRetomar,
  onEliminar,
  onIniciarEdicion,
  onCancelarEdicion,
  onGuardarEdicion,
  onEditTitleChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      whileHover={{
        x: 5,
        boxShadow: 'var(--shadow-xl)',
        borderColor: 'var(--color-primary-light)'
      }}
      onClick={() => onRetomar(proyecto)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--color-surface)',
        padding: 'var(--spacing-xl) var(--spacing-2xl)',
        borderRadius: 'var(--radius-xl)',
        cursor: 'pointer',
        border: '1px solid var(--color-border-light)',
        boxShadow: 'var(--shadow-lg)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div style={{ flex: 1, marginRight: 'var(--spacing-lg)' }}>
        {isEditing ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onGuardarEdicion(e, proyecto.id);
                if (e.key === 'Escape') onCancelarEdicion(e);
              }}
              autoFocus
              style={{
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-primary)',
                background: 'var(--color-surface-solid)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                width: '100%',
                outline: 'none'
              }}
            />
            <button
              onClick={(e) => onGuardarEdicion(e, proyecto.id)}
              style={{ background: 'var(--color-success)', color: 'white', border: 'none', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Check size={18} />
            </button>
            <button
              onClick={onCancelarEdicion}
              style={{ background: 'var(--color-danger)', color: 'white', border: 'none', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <h3 style={{ margin: 0, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              {proyecto.nombre_proyecto || 'Expediente Clasificado (Sin Título)'}
            </h3>
            <button
              onClick={(e) => onIniciarEdicion(e, proyecto)}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)', padding: 'var(--spacing-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
              title="Editar Nombre"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', color: 'var(--color-text-tertiary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
          <span style={{ display: 'inline-block', padding: 'var(--spacing-xs) var(--spacing-lg)', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-primary-light)' }}>
            Tipo: {proyecto.tipo_proyecto}
          </span>
          <span style={{ display: 'inline-block', padding: 'var(--spacing-xs) var(--spacing-lg)', background: 'var(--color-success-light)', color: 'var(--color-success-dark)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-success-light)' }}>
            Fase Actual: {proyecto.fase_actual}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
        <button
          onClick={(e) => onEliminar(e, proyecto.id)}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-danger)', padding: 'var(--spacing-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-full)', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-danger-light)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Trash2 size={20} />
        </button>
        <div style={{ color: 'var(--color-text-inverse)', background: 'var(--gradient-primary)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-md)' }}>
          <ArrowRight size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default ProyectoItem;
