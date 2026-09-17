import React, { useState } from 'react';
import { useUnlockedStep } from '../../hooks/useUnlockedStep';

const SubMenuFases = ({ tabs, currentStep, onTabClick, color = '#3b82f6', maxStep: explicitMaxStep }) => {
  const computedMaxStep = useUnlockedStep(currentStep);
  const maxStep = explicitMaxStep !== undefined ? explicitMaxStep : computedMaxStep;
  const [hoveredTab, setHoveredTab] = useState(null);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'flex-start', 
      marginBottom: '3rem', 
      background: 'white', 
      padding: '0.5rem', 
      borderRadius: '1rem', 
      border: '1px solid #e2e8f0', 
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', 
      overflowX: 'auto', 
      gap: '0.5rem' 
    }}>
      {tabs.map(t => {
        const isActive = currentStep === t.id;
        const isHovered = hoveredTab === t.id;
        const showLabel = isActive || isHovered;
        
        return (
          <button 
            key={t.id} 
            title={t.label}
            onMouseEnter={() => setHoveredTab(t.id)}
            onMouseLeave={() => setHoveredTab(null)}
            onClick={() => {
              if (t.id <= maxStep) onTabClick(t.id);
            }} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '0.75rem', 
              background: isActive ? color : (isHovered && t.id <= maxStep ? '#f1f5f9' : 'transparent'), 
              color: isActive ? 'white' : (t.id > maxStep ? '#cbd5e1' : '#64748b'), 
              border: 'none', 
              borderRadius: '0.5rem', 
              cursor: t.id > maxStep ? 'not-allowed' : 'pointer', 
              fontWeight: 600, 
              transition: 'all 0.3s ease-in-out',
              opacity: t.id > maxStep ? 0.6 : 1,
            }}
          >
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              {t.icon} 
            </div>
            <span style={{ 
              display: 'inline-block', 
              whiteSpace: 'nowrap', 
              fontSize: '0.9rem',
              maxWidth: showLabel ? '250px' : '0',
              opacity: showLabel ? 1 : 0,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              marginLeft: showLabel ? '0.5rem' : '0'
            }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SubMenuFases;
