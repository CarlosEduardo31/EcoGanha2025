// src/types/dual-mode.ts - NOVO ARQUIVO

// Tipo para modo de contagem
export type CountingMode = 'weight' | 'unit';

// Interface para resposta de configuração
export interface ConfigResponse {
  counting_mode: CountingMode;
  description: string;
}

// Interface atualizada para Material (incluindo pontos por unidade)
export interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
  pointsPerUnit: number;  // NOVO: pontos por unidade
}

// Interface atualizada para transação de reciclagem
export interface RecycleTransaction {
  id: string;
  materialName: string;
  weight: number;         // Peso em kg
  quantity: number;       // NOVO: quantidade em unidades
  points: number;
  date: string;
  ecoPointName: string;
}

// Interface atualizada para dados de transação
export interface TransactionData {
  userId: string;
  materialId: string;
  weight?: number;        // Opcional - usado no modo peso
  quantity?: number;      // NOVO: Opcional - usado no modo unidade
  ecoPointId: string;
  notes?: string;
}

// Interface para EcoPoint atualizada
export interface EcoPoint {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  operatorId?: string | number;
  materials?: Material[];
  counting_mode?: CountingMode; // NOVO: modo de contagem pode vir da API
}

// Interface para estatísticas adaptáveis
export interface EcoPointStats {
  totalRecycledToday: number;
  pointsDistributed: number;
  usersServed: number;
  mostRecycledMaterial: string | null;
  materialDistribution: Array<{
    name: string;
    totalAmount: number;    // Pode ser peso ou quantidade
    percentage: number;
  }>;
  counting_mode: CountingMode;
  unit_label: string;       // NOVO: label da unidade ("kg" ou "unidades")
}

// Interface para exibição adaptativa de quantidade
export interface QuantityDisplayProps {
  transaction: RecycleTransaction;
  mode: CountingMode;
  className?: string;
}

// Interface para exibição adaptativa de pontos de material
export interface MaterialPointsProps {
  material: Material;
  mode: CountingMode;
  className?: string;
}

// Interface para input adaptativo
export interface AdaptiveInputProps {
  mode: CountingMode;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

// Enum para tipos de exibição de estatísticas
export enum StatsDisplayType {
  WEIGHT = 'weight',
  UNIT = 'unit',
  POINTS = 'points'
}

// Interface para configurações do sistema
export interface SystemConfig {
  key: string;
  value: string;
  description: string;
}

// Tipo para resposta de switch de modo
export interface SwitchModeResponse {
  counting_mode: CountingMode;
  message: string;
}

// Helper types para validação
export type WeightTransaction = TransactionData & { weight: number };
export type UnitTransaction = TransactionData & { quantity: number };

// Interface para provider de configuração (Context)
export interface ConfigContextType {
  mode: CountingMode;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  switchMode: (newMode: CountingMode) => Promise<void>;
  isWeight: boolean;
  isUnit: boolean;
}

// Constantes úteis
export const COUNTING_MODES = {
  WEIGHT: 'weight' as CountingMode,
  UNIT: 'unit' as CountingMode
};

export const MODE_LABELS = {
  [COUNTING_MODES.WEIGHT]: {
    singular: 'kg',
    plural: 'kg',
    input: 'Peso (kg)',
    stats: 'Material Reciclado (kg)',
    transaction: 'Peso'
  },
  [COUNTING_MODES.UNIT]: {
    singular: 'unidade',
    plural: 'unidades', 
    input: 'Quantidade (unidades)',
    stats: 'Itens Reciclados (unidades)',
    transaction: 'Quantidade'
  }
};

// Tipo para labels de modo
export type ModeLabels = typeof MODE_LABELS;

// Interface para validação de transação
export interface TransactionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}