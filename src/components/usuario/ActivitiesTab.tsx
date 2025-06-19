// src/components/usuario/ActivitiesTab.tsx - CORRIGIDO PARA DUAL MODE

import React from 'react';
import { User } from '@/contexts/AuthContext';
import { UserTabType } from '@/types/comum'; // Manter apenas tipos não conflitantes
import { RecycleTransaction } from '@/types/dual-mode'; // MUDANÇA: Importar do dual-mode
import { useCountingMode } from '@/hooks/useCountingMode';
import { 
  QuantityDisplay, 
  StatsDisplay, 
  ModeIndicator 
} from '@/components/common/AdaptiveComponents';

interface ActivitiesTabProps {
  user: User;
  recycleHistory: RecycleTransaction[]; // Agora usa o tipo correto
  onTabChange: (tab: UserTabType) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ 
  user, 
  recycleHistory, 
  onTabChange 
}) => {
  // Hook para modo de contagem
  const { mode, loading: modeLoading, isWeight, getStatsLabel } = useCountingMode();

  // Função para calcular total baseado no modo
  const calculateTotal = (transactions: RecycleTransaction[]): number => {
    return transactions.reduce((sum, item) => {
      const value = isWeight ? (Number(item.weight) || 0) : (Number(item.quantity) || 0);
      return sum + value;
    }, 0);
  };

  // Função para calcular estatísticas de materiais baseado no modo
  const calculateMaterialStats = (transactions: RecycleTransaction[]) => {
    const materialStats = transactions.reduce((acc, item) => {
      const value = isWeight ? (Number(item.weight) || 0) : (Number(item.quantity) || 0);
      acc[item.materialName] = (acc[item.materialName] || 0) + value;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(materialStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div>
      <div className="mb-4">
        <button 
          onClick={() => onTabChange('profile')}
          className="flex items-center text-[#003F25] mb-4 hover:underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar para o perfil
        </button>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Header com indicador de modo */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[#003F25] font-semibold text-lg">Histórico de Reciclagem</h2>
            {!modeLoading && (
              <ModeIndicator mode={mode} />
            )}
          </div>
          
          {recycleHistory.length > 0 ? (
            <div className="space-y-4">
              {recycleHistory.map(activity => (
                <div key={activity.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Reciclagem de {activity.materialName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(activity.date)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Local: {activity.ecoPointName}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {/* Componente adaptativo para exibir quantidade */}
                          {!modeLoading && (
                            <QuantityDisplay 
                              transaction={activity} 
                              mode={mode}
                            />
                          )}
                          
                          {/* Sempre mostrar peso para dados históricos se disponível */}
                          {isWeight === false && activity.weight > 0 && (
                            <div className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                              Histórico: {Number(activity.weight) || 0} kg
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium">
                      +{Number(activity.points) || 0} pontos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma reciclagem ainda</h3>
              <p className="text-gray-500 mb-4">
                Visite um Eco Ponto para começar a reciclar e ganhar pontos!
              </p>
              <button 
                onClick={() => onTabChange('map')}
                className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors"
              >
                Encontrar Eco Pontos
              </button>
            </div>
          )}
        </div>

        {/* Estatísticas do usuário - ADAPTADAS PARA DUAL MODE */}
        {recycleHistory.length > 0 && !modeLoading && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-[#003F25] font-semibold text-lg mb-4">Suas Estatísticas</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-500">Total de Pontos Ganhos</p>
                <p className="text-xl font-bold text-[#003F25]">
                  {recycleHistory.reduce((sum, item) => sum + (Number(item.points) || 0), 0)}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                {/* Estatística adaptativa baseada no modo */}
                <p className="text-sm text-gray-500">{getStatsLabel()}</p>
                <p className="text-xl font-bold text-[#003F25]">
                  {isWeight 
                    ? calculateTotal(recycleHistory).toFixed(1)
                    : calculateTotal(recycleHistory).toString()
                  }
                </p>
              </div>
            </div>

            {/* Materiais mais reciclados - ADAPTADO */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-700 mb-3">
                Materiais mais reciclados 
                <span className="text-sm text-gray-500 ml-1">
                  ({isWeight ? 'por peso' : 'por quantidade'})
                </span>
              </h4>
              {(() => {
                const sortedMaterials = calculateMaterialStats(recycleHistory);

                return sortedMaterials.length > 0 ? (
                  <div className="space-y-2">
                    {sortedMaterials.map(([material, value], index) => (
                      <div key={material} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center">
                          <span className={`w-6 h-6 rounded-full text-white text-xs flex items-center justify-center mr-2 ${
                            index === 0 ? 'bg-yellow-500' : 
                            index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="font-medium">{material}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {isWeight ? `${value.toFixed(1)} kg` : `${value} unidades`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                );
              })()}
            </div>

            {/* Informação sobre modo dual (para usuários que têm dados históricos) */}
            {isWeight === false && recycleHistory.some(t => t.weight > 0) && (
              <div className="border-t pt-4 mt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium">Dados Históricos</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Você tem dados de reciclagem tanto por peso quanto por unidade. 
                    O sistema agora está configurado para mostrar por unidades.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading state para modo */}
        {modeLoading && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesTab;