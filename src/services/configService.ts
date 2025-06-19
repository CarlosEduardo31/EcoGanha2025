// src/services/configService.ts - NOVO ARQUIVO

import api from './api';

// Tipos para configuração
export type CountingMode = 'weight' | 'unit';

export interface ConfigResponse {
  counting_mode: CountingMode;
  description: string;
}

export interface SwitchModeResponse {
  counting_mode: CountingMode;
  message: string;
}

/**
 * Serviço para gerenciar configurações do sistema
 */
export const configService = {
  /**
   * Busca o modo de contagem atual do sistema
   * @returns Modo de contagem ('weight' ou 'unit')
   */
  getCountingMode: async (): Promise<CountingMode> => {
    try {
      const response = await api.get('/config/counting-mode');
      return response.data.data.counting_mode;
    } catch (error) {
      console.error('Erro ao buscar modo de contagem:', error);
      // Fallback para peso em caso de erro
      return 'weight';
    }
  },

  /**
   * Altera o modo de contagem do sistema (apenas admin)
   * @param mode - Novo modo ('weight' ou 'unit')
   * @returns Resposta da API
   */
  switchCountingMode: async (mode: CountingMode): Promise<SwitchModeResponse> => {
    try {
      const response = await api.post('/config/switch-counting-mode', { mode });
      return response.data.data;
    } catch (error) {
      console.error('Erro ao alterar modo de contagem:', error);
      throw error;
    }
  },

  /**
   * Busca uma configuração específica
   * @param key - Chave da configuração
   * @returns Valor da configuração
   */
  getConfig: async (key: string): Promise<string | null> => {
    try {
      const response = await api.get(`/config/${key}`);
      return response.data.data.value;
    } catch (error) {
      console.error(`Erro ao buscar configuração ${key}:`, error);
      return null;
    }
  },

  /**
   * Lista todas as configurações (apenas admin)
   * @returns Array com todas as configurações
   */
  listAllConfigs: async (): Promise<Array<{key: string, value: string, description: string}>> => {
    try {
      const response = await api.get('/config');
      return response.data.data;
    } catch (error) {
      console.error('Erro ao listar configurações:', error);
      throw error;
    }
  },

  /**
   * Atualiza uma configuração específica (apenas admin)
   * @param key - Chave da configuração
   * @param value - Novo valor
   * @returns Sucesso da operação
   */
  updateConfig: async (key: string, value: string): Promise<boolean> => {
    try {
      await api.put(`/config/${key}`, { value });
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar configuração ${key}:`, error);
      throw error;
    }
  }
};