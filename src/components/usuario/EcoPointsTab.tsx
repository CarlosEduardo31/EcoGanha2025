// src/components/usuario/EcoPointsTab.tsx - CORRIGIDO PARA DUAL MODE

import React from 'react';
import { UserTabType } from '@/types/comum'; // Manter apenas tipos não conflitantes
import { EcoPoint } from '@/types/dual-mode'; // MUDANÇA: Importar EcoPoint do dual-mode
import { useCountingMode } from '@/hooks/useCountingMode';
import { MaterialPoints, ModeIndicator } from '@/components/common/AdaptiveComponents';

interface EcoPointsTabProps {
  ecoPoints: EcoPoint[]; // Agora usa o tipo correto
  onTabChange: (tab: UserTabType) => void;
}

const EcoPointsTab: React.FC<EcoPointsTabProps> = ({ ecoPoints, onTabChange }) => {
  // Hook para modo de contagem
  const { mode, loading: modeLoading } = useCountingMode();

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        {/* Header com indicador de modo */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#003F25] font-semibold text-lg">Eco Pontos Próximos</h2>
          {!modeLoading && (
            <ModeIndicator mode={mode} />
          )}
        </div>
        
        {/* Explicação sobre o modo atual */}
        {!modeLoading && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center text-green-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">
                {mode === 'weight' 
                  ? 'Sistema configurado para contagem por peso (kg)'
                  : 'Sistema configurado para contagem por unidade (itens individuais)'
                }
              </span>
            </div>
          </div>
        )}
        
        {ecoPoints.length > 0 ? (
          <div className="space-y-4 mt-4">
            {ecoPoints.map(ecoPoint => (
              <div key={ecoPoint.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-[#003F25] text-lg">{ecoPoint.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{ecoPoint.address}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Horário:</span> {ecoPoint.openingHours}
                      </p>
                    </div>
                  </div>
                </div>
                
                {ecoPoint.materials && ecoPoint.materials.length > 0 && (
                  <div className="mt-3 bg-[#f0f9f6] p-3 rounded-md border border-green-100">
                    <h4 className="text-sm font-medium text-[#003F25] mb-2">
                      Materiais aceitos
                      {!modeLoading && (
                        <span className="text-xs text-gray-600 ml-1">
                          ({mode === 'weight' ? 'pontos por kg' : 'pontos por unidade'})
                        </span>
                      )}:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ecoPoint.materials.map((material, index) => (
                        <span 
                          key={material.id || index} 
                          className="bg-green-100 text-[#003F25] text-xs px-2 py-1 rounded-full border border-green-200 flex items-center gap-1"
                        >
                          <span>{material.name}</span>
                          {!modeLoading && (
                            <MaterialPoints 
                              material={material} 
                              mode={mode}
                              className="font-medium"
                            />
                          )}
                          
                          {/* Loading state para pontos */}
                          {modeLoading && (
                            <span className="animate-pulse">
                              <div className="h-3 w-12 bg-green-200 rounded"></div>
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                    
                    {/* Informação adicional sobre dual mode */}
                    {!modeLoading && mode === 'unit' && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        <strong>Dica:</strong> Conte itens individuais (ex: 1 garrafa PET = 1 unidade)
                      </div>
                    )}
                    
                    {!modeLoading && mode === 'weight' && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        <strong>Dica:</strong> Pese os materiais em quilogramas (ex: 2.5 kg de plástico)
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex space-x-2 mt-4">
                   <button 
                    onClick={() => {
                      const encodedAddress = encodeURIComponent(ecoPoint.address);
                      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
                      window.open(mapsUrl, '_blank');
                    }}
                    className="bg-[#003F25] text-white text-sm px-3 py-2 rounded-md flex items-center hover:bg-[#002918] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Ver no mapa
                  </button>
                  <button className="bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-md flex items-center hover:bg-gray-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Ligar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum Eco Ponto encontrado</h3>
            <p className="text-gray-500 mb-4">
              Os Eco Pontos aparecerão aqui quando estiverem disponíveis na sua região.
            </p>
            <button 
              onClick={() => onTabChange('home')}
              className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors"
            >
              Voltar ao início
            </button>
          </div>
        )}

        {/* Loading state para modo */}
        {modeLoading && (
          <div className="mt-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EcoPointsTab;