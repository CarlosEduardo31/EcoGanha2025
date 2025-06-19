// src/components/ecoponto/StatsTab.tsx - VERSÃO CORRIGIDA

import React from 'react';
import { EcoPointStats } from '@/types/dual-mode';
import { useCountingMode } from '@/hooks/useCountingMode';

interface StatsTabProps {
  statsData: EcoPointStats;
}

const StatsTab: React.FC<StatsTabProps> = ({ statsData }) => {
  const { mode, loading: modeLoading, getStatsLabel, getLabel } = useCountingMode();

  if (modeLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Estatísticas de Reciclagem</h2>
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-[#003F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-[#003F25]">Carregando estatísticas...</span>
        </div>
      </div>
    );
  }

  // Função para formatar valores baseado no modo - COM PROTEÇÃO CONTRA NULL E NaN
  const formatValue = (value: number | null | undefined): string => {
    const safeValue = Number(value) || 0;
    if (mode === 'weight') {
      return safeValue.toLocaleString('pt-BR', { 
        minimumFractionDigits: 1, 
        maximumFractionDigits: 1 
      });
    } else {
      return safeValue.toLocaleString('pt-BR');
    }
  };

  // Função para formatar porcentagem - COM PROTEÇÃO CONTRA NULL E NaN
  const formatPercentage = (percentage: number | null | undefined): string => {
    const safePercentage = Number(percentage) || 0;
    return safePercentage.toFixed(1);
  };

  // Cores para o gráfico de distribuição
  const colors = [
    'bg-green-500',
    'bg-blue-500', 
    'bg-yellow-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-gray-500'
  ];

  // Dados seguros com fallbacks e conversão para Number
  const safeStatsData = {
    totalRecycledToday: Number(statsData?.totalRecycledToday) || 0,
    pointsDistributed: Number(statsData?.pointsDistributed) || 0,
    usersServed: Number(statsData?.usersServed) || 0,
    mostRecycledMaterial: statsData?.mostRecycledMaterial || 'Nenhum',
    materialDistribution: statsData?.materialDistribution || [],
    unit_label: statsData?.unit_label || getLabel()
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg">Estatísticas de Reciclagem</h2>
        
        {/* Indicador do modo atual */}
        <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            mode === 'weight' ? 'bg-blue-500' : 'bg-green-500'
          }`}></div>
          <span className="text-gray-700 font-medium">
            {mode === 'weight' ? 'Contagem por Peso' : 'Contagem por Unidade'}
          </span>
        </div>
      </div>
      
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Total Reciclado Hoje</p>
              <p className="text-2xl font-bold text-green-800">
                {formatValue(safeStatsData.totalRecycledToday)}
              </p>
              <p className="text-xs text-green-600">
                {safeStatsData.unit_label}
              </p>
            </div>
            <div className="bg-green-200 p-2 rounded-full">
              {mode === 'weight' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Pontos Distribuídos</p>
              <p className="text-2xl font-bold text-blue-800">
                {safeStatsData.pointsDistributed.toLocaleString('pt-BR')}
              </p>
              <p className="text-xs text-blue-600">pontos</p>
            </div>
            <div className="bg-blue-200 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Usuários Atendidos</p>
              <p className="text-2xl font-bold text-purple-800">{safeStatsData.usersServed}</p>
              <p className="text-xs text-purple-600">pessoas</p>
            </div>
            <div className="bg-purple-200 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Material Popular</p>
              <p className="text-lg font-bold text-yellow-800 leading-tight">
                {safeStatsData.mostRecycledMaterial}
              </p>
              <p className="text-xs text-yellow-600">mais reciclado</p>
            </div>
            <div className="bg-yellow-200 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Distribuição por Material */}
      <div className="mb-4">
        <h3 className="text-[#003F25] font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Distribuição por Material
        </h3>
        
        {safeStatsData.materialDistribution.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Nenhum material reciclado ainda</p>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              {safeStatsData.materialDistribution.map((material, index) => {
                // Proteção contra valores null/undefined/NaN
                const safeMaterial = {
                  name: material?.name || 'Material Desconhecido',
                  totalAmount: Number(material?.totalAmount) || 0,
                  percentage: Number(material?.percentage) || 0
                };

                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]} mr-3 flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {safeMaterial.name}
                          </span>
                          <div className="flex items-center space-x-2 text-sm">
                            <span className="font-medium text-gray-700">
                              {formatValue(safeMaterial.totalAmount)} {getLabel()}
                            </span>
                            <span className="font-bold text-[#003F25]">
                              {formatPercentage(safeMaterial.percentage)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${Math.max(0, Math.min(100, safeMaterial.percentage))}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer informativo */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center text-sm text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            Estatísticas atualizadas em tempo real. 
            Modo atual: <strong>{mode === 'weight' ? 'Peso (kg)' : 'Unidade (itens)'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;