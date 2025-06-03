// src/components/usuario/RewardsTab.tsx

import React from 'react';
import Image from 'next/image';
import { User } from '@/contexts/AuthContext';
import { Partner, SelectedPartner, UserTabType } from '@/types/comum';

interface RewardsTabProps {
  user: User;
  partners: Partner[];
  selectedPartner: SelectedPartner | null;
  setSelectedPartner: (partner: SelectedPartner | null) => void;
  onTabChange: (tab: UserTabType) => void;
}

const RewardsTab: React.FC<RewardsTabProps> = ({ 
  user, 
  partners,
  selectedPartner, 
  setSelectedPartner, 
  onTabChange 
}) => {
  // NOVA FUNÇÃO: Filtrar parceiros que têm ofertas disponíveis
  const partnersWithAvailableOffers = partners.filter(partner => 
    partner.offers && partner.offers.some(offer => offer.quantity > 0)
  );

  return (
    <div>
      {selectedPartner ? (
        <div className="mb-4">
          <button 
            onClick={() => setSelectedPartner(null)}
            className="flex items-center text-[#003F25] mb-4 hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para todos os parceiros
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center mb-4">
              {selectedPartner.logo ? (
                <Image 
                  src={selectedPartner.logo} 
                  alt={selectedPartner.name} 
                  width={60} 
                  height={60}
                  className="mr-4 rounded"
                />
              ) : (
                <div className="w-15 h-15 bg-[#FBCA27] rounded mr-4 flex items-center justify-center">
                  <span className="text-[#003F25] text-2xl font-bold">
                    {selectedPartner.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold text-[#003F25]">{selectedPartner.name}</h2>
                <p className="text-gray-600 text-sm">Parceiro oficial do EcoGanha</p>
              </div>
            </div>
            
            <div className="bg-[#f0f9f6] rounded-lg p-3 mb-4 border border-green-100">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#003F25] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="font-medium text-[#003F25]">Localização do Stand</h3>
                  <p className="text-sm">{selectedPartner.location}</p>
                  <button 
                    onClick={() => onTabChange('map')}
                    className="mt-2 text-sm text-[#003F25] font-medium underline flex items-center hover:no-underline"
                  >
                    Ver no mapa
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <h3 className="font-semibold text-[#003F25] mb-3">Prêmios Disponíveis</h3>
            
            <div className="space-y-4">
              {/* ATUALIZADO: Filtrar apenas ofertas disponíveis */}
              {selectedPartner.offers && selectedPartner.offers.filter(offer => offer.quantity > 0).length > 0 ? (
                selectedPartner.offers
                  .filter(offer => offer.quantity > 0)
                  .map(offer => (
                     <div key={offer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex flex-col sm:flex-row gap-4 mb-3 sm:min-h-[160px]">
                        {/* NOVO: Mostrar imagem da oferta - ocupa toda altura em tablets+ */}
                        {offer.image ? (
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-48 sm:w-40 h-48 sm:h-full object-scale-down rounded-lg border border-gray-200 flex-shrink-0 self-center"
                          />
                        ) : (
                          <div className="w-full sm:w-40 h-48 sm:h-full bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center self-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                            <h4 className="font-medium text-[#003F25] text-lg">{offer.title}</h4>
                            <div className="bg-[#FBCA27] px-3 py-1 rounded-full text-sm font-medium text-[#003F25] self-start">
                              {Number(offer.points) || 0} pontos
                            </div>
                          </div>
                          
                          {offer.description && (
                            <p className="text-sm text-gray-600">{offer.description}</p>
                          )}
                          
                          {offer.validUntil && (
                            <p className="text-xs text-gray-500">
                              Válido até: {new Date(offer.validUntil).toLocaleDateString('pt-BR')}
                            </p>
                          )}
                          
                          {/* Mostrar quantidade disponível */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              offer.quantity > 10 
                                ? 'bg-green-100 text-green-700'
                                : offer.quantity > 5
                                  ? 'bg-yellow-100 text-yellow-700' 
                                  : 'bg-orange-100 text-orange-700'
                            }`}>
                              {offer.quantity} disponíveis
                            </span>
                            {offer.quantity <= 5 && (
                              <span className="text-xs text-orange-600 font-medium">
                                Últimas unidades!
                              </span>
                            )}
                          </div>
                          
                          {/* Status de pontos */}
                          <div className={`py-2 px-3 rounded-md text-center text-sm ${
                            user.points >= (Number(offer.points) || 0)
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {user.points >= (Number(offer.points) || 0)
                              ? `✓ Você tem pontos suficientes (${user.points}/${Number(offer.points) || 0})` 
                              : `Faltam ${(Number(offer.points) || 0) - user.points} pontos para resgatar`}
                          </div>
                          
                          {/* Instruções de resgate */}
                          <div className="text-sm text-[#003F25] bg-[#f0f9f6] p-3 rounded-md">
                            <p className="font-medium mb-1">Como resgatar:</p>
                            <p>Visite o stand da {selectedPartner.name} e apresente seu perfil no app para o atendente resgatar este prêmio.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Ofertas Esgotadas</h3>
                  <p className="text-gray-500">Este parceiro não tem ofertas disponíveis no momento.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-[#003F25] font-semibold text-lg mb-4">Todos os Parceiros</h2>
          
          {/* ATUALIZADO: Usar apenas parceiros com ofertas disponíveis */}
          {partnersWithAvailableOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {partnersWithAvailableOffers.map(partner => {
                // Calcular ofertas disponíveis para este parceiro
                const availableOffers = partner.offers?.filter(offer => offer.quantity > 0) || [];
                const minPoints = availableOffers.length > 0 
                  ? Math.min(...availableOffers.map(o => Number(o.points) || 0))
                  : 0;

                return (
                  <div key={partner.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      {partner.logo ? (
                        <Image 
                          src={partner.logo} 
                          alt={partner.name} 
                          width={48} 
                          height={48}
                          className="mr-3 rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#FBCA27] rounded mr-3 flex items-center justify-center">
                          <span className="text-[#003F25] text-lg font-bold">
                            {partner.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{partner.name}</h3>
                        <p className="text-sm text-gray-600">
                          {partner.location || "Stand do São João, Pátio de Eventos"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">Parceiro oficial do EcoGanha</p>
                      {availableOffers.length > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-600">
                            A partir de {minPoints} pontos
                          </p>
                          {/* NOVO: Indicador de quantidade limitada */}
                          {availableOffers.some(offer => offer.quantity <= 5) && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                              Estoque limitado
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <span className="text-sm text-gray-600">
                          {availableOffers.length} prêmio{availableOffers.length !== 1 ? 's' : ''} disponível{availableOffers.length !== 1 ? 'eis' : ''}
                        </span>
                        {/* NOVO: Mostrar total de unidades disponíveis */}
                        {availableOffers.length > 0 && (
                          <span className="text-xs text-gray-500 block">
                            {availableOffers.reduce((sum, offer) => sum + offer.quantity, 0)} unidades totais
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => setSelectedPartner({
                          ...partner,
                          location: partner.location || "Stand do São João, Pátio de Eventos"
                        })}
                        className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition-colors text-sm flex items-center"
                      >
                        Ver detalhes
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma oferta disponível</h3>
              <p className="text-gray-500">
                Todas as ofertas estão esgotadas no momento. Volte em breve para ver novas ofertas!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RewardsTab;