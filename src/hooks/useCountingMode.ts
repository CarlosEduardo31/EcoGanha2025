// src/hooks/useCountingMode.ts - NOVO ARQUIVO

import { useState, useEffect, useCallback } from 'react';
import { configService, CountingMode } from '@/services/configService';

interface UseCountingModeReturn {
  mode: CountingMode;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  isWeight: boolean;
  isUnit: boolean;
  getLabel: (singular?: boolean) => string;
  getInputLabel: () => string;
  getStatsLabel: () => string;
}

/**
 * Hook personalizado para gerenciar o modo de contagem do sistema
 * @returns Objeto com modo atual, estado de loading e funções utilitárias
 */
export const useCountingMode = (): UseCountingModeReturn => {
  const [mode, setMode] = useState<CountingMode>('weight');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para carregar o modo atual
  const loadMode = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentMode = await configService.getCountingMode();
      setMode(currentMode);
    } catch (err) {
      console.error('Erro ao carregar modo de contagem:', err);
      setError('Erro ao carregar configuração');
      // Fallback para peso
      setMode('weight');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar modo na inicialização
  useEffect(() => {
    loadMode();
  }, [loadMode]);

  // Função para refresh manual
  const refresh = useCallback(async () => {
    await loadMode();
  }, [loadMode]);

  // Computed values para facilitar uso
  const isWeight = mode === 'weight';
  const isUnit = mode === 'unit';

  // Funções utilitárias para labels
  const getLabel = useCallback((singular: boolean = false): string => {
    if (mode === 'weight') {
      return singular ? 'kg' : 'kg';
    } else {
      return singular ? 'unidade' : 'unidades';
    }
  }, [mode]);

  const getInputLabel = useCallback((): string => {
    if (mode === 'weight') {
      return 'Peso (kg)';
    } else {
      return 'Quantidade (unidades)';
    }
  }, [mode]);

  const getStatsLabel = useCallback((): string => {
    if (mode === 'weight') {
      return 'Material Reciclado (kg)';
    } else {
      return 'Itens Reciclados (unidades)';
    }
  }, [mode]);

  return {
    mode,
    loading,
    error,
    refresh,
    isWeight,
    isUnit,
    getLabel,
    getInputLabel,
    getStatsLabel
  };
};