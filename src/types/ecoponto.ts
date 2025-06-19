// src/types/ecoponto.ts - VERSÃO ATUALIZADA PARA COMPATIBILIDADE

import { CountingMode } from './dual-mode';

// Tipos de dados para o dashboard do EcoPonto

// Interface atualizada para Material incluindo pontos por unidade
export interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
  pointsPerUnit: number;  // NOVO: pontos por unidade
}

// Interface atualizada para Transaction - CORRIGIDA PARA COMPATIBILIDADE
export interface Transaction {
  id: string;
  userName: string;
  userPhone: string;
  material: string;
  materialName?: string;   // OPCIONAL: nome do material
  weight: number;          // Peso em kg
  quantity?: number;       // OPCIONAL: quantidade em unidades  
  points: number;
  date: string;
  ecoPointName?: string;   // OPCIONAL: nome do eco ponto
}

// Interface para UserData (mantida igual)
export interface UserData {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
  age?: number;           // NOVO: idade opcional
}

// Tipo para abas do EcoPonto (mantido igual)
export type EcoPointTabType = 'search' | 'history' | 'stats' | 'profile';

// NOVAS INTERFACES PARA DUAL MODE

// Interface para EcoPoint completo
export interface EcoPoint {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  operatorId?: string | number;
  materials: Material[];
  counting_mode?: CountingMode;  // NOVO: modo de contagem
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
  unit_label: string;       // Label da unidade ("kg" ou "unidades")
}

// Interface para dados de transação (form)
export interface TransactionFormData {
  userId: string;
  materialId: string;
  value: number;           // Peso ou quantidade baseado no modo
  ecoPointId: string;
}

// Interface para dados de transação (API)
export interface TransactionData {
  userId: string;
  materialId: string;
  weight?: number;         // Opcional - usado no modo peso
  quantity?: number;       // Opcional - usado no modo unidade
  ecoPointId: string;
}

// Interface para resposta de transação da API
export interface TransactionResponse {
  transaction: {
    id: string;
    weight: number;
    quantity: number;
    points: number;
    date: string;
    materialName: string;
    ecoPointName: string;
  };
  user: {
    id: string;
    name: string;
    phone: string;
    userType: string;
    points: number;
  };
  counting_mode: CountingMode;
}

// Interface para props de componentes adaptativos
export interface AdaptiveComponentProps {
  mode: CountingMode;
  loading?: boolean;
  error?: string | null;
}

// Interface para validação de entrada
export interface InputValidation {
  isValid: boolean;
  errors: string[];
  value: number;
}

// Enum para tipos de entrada
export enum InputType {
  WEIGHT = 'weight',
  QUANTITY = 'quantity'
}

// Interface para configuração de input baseado no modo
export interface InputConfig {
  type: 'number';
  step: string;
  min: string;
  max: string;
  placeholder: string;
  label: string;
}

// TIPOS UTILITÁRIOS

// Tipo para operações de transação
export type TransactionOperation = 'create' | 'view' | 'stats';

// Tipo para estado de loading
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Tipo para filtros de transação
export type TransactionFilter = 'all' | 'today' | 'week' | 'month';

// Interface para estado do dashboard
export interface DashboardState {
  activeTab: EcoPointTabType;
  ecoPoint: EcoPoint | null;
  transactions: Transaction[];
  stats: EcoPointStats | null;
  loading: LoadingState;
  error: string | null;
  mode: CountingMode;
}

// Interface para contexto do EcoPonto
export interface EcoPointContextType {
  state: DashboardState;
  actions: {
    setActiveTab: (tab: EcoPointTabType) => void;
    refreshData: () => Promise<void>;
    createTransaction: (data: TransactionData) => Promise<void>;
    searchUser: (phone: string) => Promise<UserData | null>;
  };
}

// Constantes para configuração
export const ECOPOINT_CONFIG = {
  MAX_WEIGHT: 1000,
  MIN_WEIGHT: 0.1,
  MAX_QUANTITY: 10000,
  MIN_QUANTITY: 1,
  WEIGHT_STEP: 0.1,
  QUANTITY_STEP: 1,
} as const;

// Tipo para constantes de configuração
export type EcoPointConfig = typeof ECOPOINT_CONFIG;

// Export de tipos legados para compatibilidade
export type LegacyMaterial = Omit<Material, 'pointsPerUnit'>;
export type LegacyTransaction = Omit<Transaction, 'quantity' | 'materialName' | 'ecoPointName'>;