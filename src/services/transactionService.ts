// src/services/transactionService.ts - MODIFICADO PARA DUAL MODE

import api from './api';
import { TransactionData, CountingMode } from '@/types/dual-mode'; // Usar novos tipos

// Interface para resposta de transação
interface TransactionResponse {
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
  counting_mode: CountingMode; // NOVO: modo usado na transação
}

// Interface para resposta de estatísticas
interface StatsResponse {
  totalRecycledToday: number;
  pointsDistributed: number;
  usersServed: number;
  mostRecycledMaterial: string | null;
  materialDistribution: Array<{
    name: string;
    totalAmount: number;
    percentage: number;
  }>;
  counting_mode: CountingMode;
  unit_label: string;
}

export const transactionService = {
  /**
   * Registrar nova transação de reciclagem - ATUALIZADA PARA DUAL MODE
   * @param data - Dados da transação (com weight OU quantity)
   * @returns Dados da transação criada
   */
  create: async (data: TransactionData): Promise<TransactionResponse> => {
    try {
      const response = await api.post('/transactions', data);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },

  /**
   * Obter transações de um EcoPonto específico - ATUALIZADA
   * @param ecoPointId - ID do EcoPonto
   * @returns Lista de transações com dados de ambos os modos
   */
  getByEcoPoint: async (ecoPointId: string) => {
    try {
      const response = await api.get(`/transactions/eco-point/${ecoPointId}`);
      return {
        transactions: response.data.data,
        counting_mode: response.data.counting_mode || 'weight' // Fallback
      };
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  },
  
  /**
   * Alias para getByEcoPoint para compatibilidade com componentes existentes
   */
  listByEcoPoint: async (ecoPointId: string) => {
    return await transactionService.getByEcoPoint(ecoPointId);
  },

  /**
   * Obter estatísticas de um EcoPonto - ATUALIZADA PARA DUAL MODE
   * @param ecoPointId - ID do EcoPonto
   * @returns Estatísticas adaptadas ao modo atual
   */
  getEcoPointStats: async (ecoPointId: string): Promise<StatsResponse> => {
    try {
      const response = await api.get(`/transactions/eco-point/${ecoPointId}/stats`);
      return response.data.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // NOVAS FUNÇÕES UTILITÁRIAS PARA DUAL MODE

  /**
   * Valida dados de transação baseado no modo
   * @param data - Dados da transação
   * @param mode - Modo de contagem atual
   * @returns Objeto com validação
   */
  validateTransactionData: (data: Partial<TransactionData>, mode: CountingMode) => {
    const errors: string[] = [];
    
    // Validações comuns
    if (!data.userId) errors.push('ID do usuário é obrigatório');
    if (!data.materialId) errors.push('Material é obrigatório');
    if (!data.ecoPointId) errors.push('EcoPonto é obrigatório');
    
    // Validações específicas por modo
    if (mode === 'weight') {
      if (!data.weight || data.weight <= 0) {
        errors.push('Peso deve ser maior que zero');
      }
      if (data.weight && data.weight > 1000) {
        errors.push('Peso muito alto (máximo 1000kg)');
      }
    } else {
      if (!data.quantity || data.quantity <= 0) {
        errors.push('Quantidade deve ser maior que zero');
      }
      if (data.quantity && data.quantity > 10000) {
        errors.push('Quantidade muito alta (máximo 10000 unidades)');
      }
      if (data.quantity && !Number.isInteger(data.quantity)) {
        errors.push('Quantidade deve ser um número inteiro');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Prepara dados de transação baseado no modo
   * @param formData - Dados do formulário
   * @param mode - Modo de contagem
   * @returns Dados preparados para envio
   */
  prepareTransactionData: (
    formData: { 
      userId: string; 
      materialId: string; 
      value: number; 
      ecoPointId: string; 
    }, 
    mode: CountingMode
  ): TransactionData => {
    const baseData = {
      userId: formData.userId,
      materialId: formData.materialId,
      ecoPointId: formData.ecoPointId
    };

    if (mode === 'weight') {
      return {
        ...baseData,
        weight: formData.value,
        quantity: 0 // Valor padrão
      };
    } else {
      return {
        ...baseData,
        weight: 0, // Valor padrão
        quantity: Math.floor(formData.value) // Garantir inteiro
      };
    }
  },

  /**
   * Calcula pontos estimados baseado no material e modo
   * @param material - Dados do material
   * @param value - Valor (peso ou quantidade)
   * @param mode - Modo de contagem
   * @returns Pontos estimados
   */
  calculateEstimatedPoints: (
    material: { pointsPerKg: number; pointsPerUnit: number }, 
    value: number, 
    mode: CountingMode
  ): number => {
    if (mode === 'weight') {
      return Math.round(value * material.pointsPerKg);
    } else {
      return Math.floor(value) * material.pointsPerUnit;
    }
  }
};