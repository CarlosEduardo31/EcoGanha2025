// src/components/common/AdaptiveComponents.tsx - NOVOS COMPONENTES

import React from 'react';
import { 
  RecycleTransaction, 
  Material, 
  CountingMode,
  QuantityDisplayProps,
  MaterialPointsProps,
  AdaptiveInputProps
} from '@/types/dual-mode';

/**
 * Componente para exibir quantidade adaptativa (peso ou unidades)
 */
export const QuantityDisplay: React.FC<QuantityDisplayProps> = ({ 
  transaction, 
  mode, 
  className = "bg-gray-100 px-2 py-1 rounded text-xs text-gray-700" 
}) => {
  const value = mode === 'weight' ? transaction.weight : transaction.quantity;
  const label = mode === 'weight' ? 'Peso' : 'Quantidade';
  const unit = mode === 'weight' ? 'kg' : 'unidades';

  return (
    <div className={className}>
      {label}: {Number(value) || 0} {unit}
    </div>
  );
};

/**
 * Componente para exibir pontos de material adaptativos
 */
export const MaterialPoints: React.FC<MaterialPointsProps> = ({ 
  material, 
  mode, 
  className = "" 
}) => {
  const points = mode === 'weight' ? material.pointsPerKg : material.pointsPerUnit;
  const unit = mode === 'weight' ? 'kg' : 'unidade';

  return (
    <span className={className}>
      ({points} pts/{unit})
    </span>
  );
};

/**
 * Input adaptativo para peso ou quantidade
 */
export const AdaptiveInput: React.FC<AdaptiveInputProps> = ({
  mode,
  value,
  onChange,
  min = 0,
  max,
  step,
  placeholder,
  className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]",
  required = false
}) => {
  const inputStep = step || (mode === 'weight' ? 0.1 : 1);
  const inputMax = max || (mode === 'weight' ? 1000 : 10000);
  const inputPlaceholder = placeholder || (mode === 'weight' ? 'Ex: 2.5' : 'Ex: 5');
  
  return (
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={inputMax}
      step={inputStep}
      placeholder={inputPlaceholder}
      className={className}
      required={required}
    />
  );
};

/**
 * Label adaptativo para input
 */
interface AdaptiveLabelProps {
  mode: CountingMode;
  required?: boolean;
  className?: string;
}

export const AdaptiveLabel: React.FC<AdaptiveLabelProps> = ({ 
  mode, 
  required = false,
  className = "block text-sm font-medium text-gray-700 mb-1"
}) => {
  const label = mode === 'weight' ? 'Peso (kg)' : 'Quantidade (unidades)';
  
  return (
    <label className={className}>
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
};

/**
 * Exibição de estatísticas adaptativas
 */
interface StatsDisplayProps {
  total: number;
  mode: CountingMode;
  className?: string;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ 
  total, 
  mode, 
  className = "text-xl font-bold text-[#003F25]" 
}) => {
  const label = mode === 'weight' ? 'kg' : 'unidades';
  const displayValue = mode === 'weight' ? total.toFixed(1) : total.toString();
  
  return (
    <div>
      <p className={className}>{displayValue}</p>
      <div className="text-sm text-gray-600">
        {mode === 'weight' ? 'Material Reciclado (kg)' : 'Itens Reciclados (unidades)'}
      </div>
    </div>
  );
};

/**
 * Card de material com informações adaptativas
 */
interface MaterialCardProps {
  material: Material;
  mode: CountingMode;
  onSelect?: (material: Material) => void;
  className?: string;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  mode,
  onSelect,
  className = "bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
}) => {
  return (
    <div 
      className={className}
      onClick={() => onSelect?.(material)}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-800">{material.name}</h3>
        <MaterialPoints material={material} mode={mode} className="text-sm text-green-600" />
      </div>
    </div>
  );
};

/**
 * Indicador visual do modo atual
 */
interface ModeIndicatorProps {
  mode: CountingMode;
  className?: string;
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({ 
  mode, 
  className = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
}) => {
  const modeConfig = {
    weight: {
      label: 'Modo Peso',
      color: 'bg-blue-100 text-blue-800',
      icon: '⚖️'
    },
    unit: {
      label: 'Modo Unidade',
      color: 'bg-green-100 text-green-800', 
      icon: '📊'
    }
  };

  const config = modeConfig[mode];

  return (
    <span className={`${className} ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

/**
 * Botão para alternar modo (apenas admin)
 */
interface ModeSwitchButtonProps {
  currentMode: CountingMode;
  onSwitch: (newMode: CountingMode) => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ModeSwitchButton: React.FC<ModeSwitchButtonProps> = ({
  currentMode,
  onSwitch,
  loading = false,
  disabled = false,
  className = "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50"
}) => {
  const newMode = currentMode === 'weight' ? 'unit' : 'weight';
  const newModeLabel = newMode === 'weight' ? 'Peso' : 'Unidade';

  return (
    <button
      onClick={() => onSwitch(newMode)}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Alterando...
        </span>
      ) : (
        `Trocar para ${newModeLabel}`
      )}
    </button>
  );
};

/**
 * Tooltip explicativo sobre o modo atual
 */
interface ModeTooltipProps {
  mode: CountingMode;
  className?: string;
}

export const ModeTooltip: React.FC<ModeTooltipProps> = ({ 
  mode, 
  className = "bg-gray-800 text-white text-xs rounded px-2 py-1" 
}) => {
  const explanations = {
    weight: 'Sistema configurado para medir materiais por peso (kg). Exemplo: 2.5kg de plástico.',
    unit: 'Sistema configurado para contar unidades individuais. Exemplo: 5 garrafas PET.'
  };

  return (
    <div className={className}>
      {explanations[mode]}
    </div>
  );
};