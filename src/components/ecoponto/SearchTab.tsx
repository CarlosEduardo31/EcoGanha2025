// src/components/ecoponto/SearchTab.tsx - SINCRONIZAÇÃO EM TEMPO REAL

import React, { useState, useEffect } from 'react';
import { Material, UserData } from '@/types/ecoponto';
import { useCountingMode } from '@/hooks/useCountingMode';

interface SearchTabProps {
  materials: Material[];
  recentUsers: UserData[];
  loading: boolean;
  error: string;
  success: string;
  onSearchUser: (phone: string) => Promise<void>;
  onSelectRecentUser: (user: UserData) => void;
  onAddPoints: () => Promise<void>;
  foundUser: UserData | null;
  searchPhone: string;
  setSearchPhone: (phone: string) => void;
  selectedMaterial: string;
  setSelectedMaterial: (material: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
  calculatePoints: () => number;
}

const SearchTab: React.FC<SearchTabProps> = ({
  materials,
  recentUsers,
  loading,
  error,
  success,
  onSearchUser,
  onSelectRecentUser,
  onAddPoints,
  foundUser,
  searchPhone,
  setSearchPhone,
  selectedMaterial,
  setSelectedMaterial,
  weight,
  setWeight,
  calculatePoints
}) => {
  
  // Hook para modo de contagem
  const { mode, loading: modeLoading, getInputLabel, getLabel, isWeight } = useCountingMode();
  
  // Estado local para quantidade (gerenciado internamente)
  const [quantity, setQuantity] = useState<string>('');
  
  // ← SINCRONIZAÇÃO EM TEMPO REAL
  useEffect(() => {
    if (!isWeight) {
      // Se estamos no modo unidade, sincronizar quantity → weight em tempo real
      setWeight(quantity);
    }
  }, [quantity, isWeight, setWeight]);

  // ← LIMPEZA QUANDO MODO MUDA
  useEffect(() => {
    // Limpar campos quando modo muda
    setQuantity('');
    setWeight('');
  }, [mode, setWeight]);
  
  // Determinar valor atual baseado no modo
  const currentValue = isWeight ? weight : quantity;
  
  // ← FUNÇÃO ATUALIZADA PARA SINCRONIZAR EM TEMPO REAL
  const setCurrentValue = (value: string) => {
    if (isWeight) {
      setWeight(value);
    } else {
      setQuantity(value);
      // Sincronização imediata para o dashboard
      setWeight(value);
    }
  };
  
  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 11);
    
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 3)} ${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // Função para verificar se o telefone está válido
  const isPhoneValid = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
  };

  // Função para extrair apenas os números do telefone
  const getPhoneNumbers = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setSearchPhone(formatted);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSearchUser(getPhoneNumbers(searchPhone));
  };

  // Função para calcular pontos localmente
  const calculatePointsLocal = (): number => {
    if (!selectedMaterial || !currentValue || parseFloat(currentValue) <= 0) {
      return 0;
    }

    const material = materials.find(m => String(m.id) === String(selectedMaterial));
    if (!material) return 0;

    const value = parseFloat(currentValue);
    
    if (isWeight) {
      return Math.round(value * material.pointsPerKg);
    } else {
      return Math.floor(value) * material.pointsPerUnit;
    }
  };

  // Função para obter o material selecionado
  const getSelectedMaterial = () => {
    return materials.find(m => String(m.id) === String(selectedMaterial));
  };

  // Função para obter o placeholder do input
  const getInputPlaceholder = (): string => {
    if (isWeight) {
      return 'Ex: 2.5';
    } else {
      return 'Ex: 10';
    }
  };

  // Função para obter configurações do input
  const getInputConfig = () => {
    if (isWeight) {
      return {
        type: 'number' as const,
        step: '0.1',
        min: '0.1',
        max: '1000'
      };
    } else {
      return {
        type: 'number' as const,
        step: '1',
        min: '1',
        max: '10000'
      };
    }
  };

  // ← FUNÇÃO SIMPLIFICADA - NÃO PRECISA MAIS SINCRONIZAR
  const handleAddPointsWrapper = async () => {
    console.log('🔄 Iniciando transação:', {
      mode,
      isWeight,
      currentValue,
      weight,
      quantity,
      selectedMaterial
    });
    
    await onAddPoints();
    
    // Limpar estados após sucesso
    setQuantity('');
    // weight é limpo pelo dashboard
  };

  // Mostrar loading se modo ainda está carregando
  if (modeLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-[#003F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-[#003F25]">Carregando configurações...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Buscar Usuário</h2>
        
        <form onSubmit={handleSearch}>
          <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:gap-0">
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              value={searchPhone}
              onChange={handlePhoneChange}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              maxLength={16}
            />
            <button
              type="submit"
              disabled={loading || !isPhoneValid(searchPhone)}
              className="bg-[#003F25] text-white px-4 py-2 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-[#002918] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed min-w-0 sm:min-w-fit"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="hidden sm:inline ml-1">Buscar</span>
                  <span className="sm:hidden">Buscar</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {foundUser && (
          <div className="border border-gray-200 rounded-md p-4 mb-4 mt-4 bg-gray-50">
            <div className="flex items-center mb-4">
              <div className="bg-[#FBCA27] p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#003F25]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">{foundUser.name}</p>
                <p className="text-sm text-gray-500">{formatPhone(foundUser.phone)}</p>
              </div>
              <div className="ml-auto">
                <p className="font-medium text-[#003F25]">{foundUser.points} pontos</p>
              </div>
            </div>

            <h3 className="text-[#003F25] font-semibold mb-2">Adicionar Pontos por Reciclagem</h3>
            
            {/* Indicador do modo atual */}
            <div className="mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center text-sm text-blue-700">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  isWeight ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <span className="font-medium">
                  Modo atual: {isWeight ? 'Contagem por Peso (kg)' : 'Contagem por Unidade (itens)'}
                </span>
              </div>
            </div>

            {/* ← DEBUG INFO - REMOVER EM PRODUÇÃO */}
            {/* <div className="mb-3 p-2 bg-yellow-50 rounded-lg border border-yellow-200 text-xs">
              <div className="text-yellow-700">
                <strong>Debug:</strong> Mode: {mode}, isWeight: {String(isWeight)}, currentValue: &quot;{currentValue}&quot;, weight: &quot;{weight}&quot;, quantity: &quot;{quantity}&quot;
              </div>
            </div> */}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Material Reciclável</label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              >
                <option value="">Selecione um material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name} (
                      {isWeight 
                        ? `${material.pointsPerKg} pontos/kg`
                        : `${material.pointsPerUnit} pontos/${getLabel(true)}`
                      }
                    )
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {getInputLabel()}
              </label>
              <input
                {...getInputConfig()}
                placeholder={getInputPlaceholder()}
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
              />
            </div>

            {selectedMaterial && currentValue && parseFloat(currentValue) > 0 && (
              <div className="bg-gray-100 p-3 rounded-md mb-4">
                <p className="text-center font-medium">
                  Pontos a adicionar: <span className="text-[#003F25]">{calculatePointsLocal()}</span>
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">
                  {(() => {
                    const selectedMat = getSelectedMaterial();
                    const value = parseFloat(currentValue);
                    
                    if (!selectedMat) return 'Material não encontrado';
                    
                    if (isWeight) {
                      return `${currentValue} kg de ${selectedMat.name}`;
                    } else {
                      return `${currentValue} ${value === 1 ? getLabel(true) : getLabel(false)} de ${selectedMat.name}`;
                    }
                  })()}
                </p>
              </div>
            )}

            <button
              onClick={handleAddPointsWrapper}
              disabled={loading || !selectedMaterial || !currentValue || parseFloat(currentValue) <= 0}
              className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Confirmar Reciclagem
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SearchTab;