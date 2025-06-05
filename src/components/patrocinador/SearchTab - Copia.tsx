// src/components/patrocinador/SearchTab.tsx

import React, { useState } from 'react';
import { UserData, Offer } from '@/types/patrocinador';

interface SearchTabProps {
  searchPhone: string;
  setSearchPhone: (phone: string) => void;
  foundUser: UserData | null;
  loading: boolean;
  error: string;
  success: string;
  offers: Offer[];
  selectedOffer: string;
  setSelectedOffer: (offer: string) => void;
  onSearch: () => Promise<void>;
  onRedeemPoints: () => Promise<void>;
}

const SearchTab: React.FC<SearchTabProps> = ({
  searchPhone,
  setSearchPhone,
  foundUser,
  loading,
  error,
  success,
  offers,
  selectedOffer,
  setSelectedOffer,
  onSearch,
  onRedeemPoints
}) => {
  // Estados para melhorias de UX
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessingRedeem, setIsProcessingRedeem] = useState(false);

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (celular) ou 10 dígitos (fixo)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a formatação baseada no número de dígitos
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      // Para celular com 9 dígitos (formato: (11) 9 9999-9999)
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 3)} ${limitedNumbers.slice(3, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // Função para extrair apenas os números do telefone
  const getPhoneNumbers = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 11);
    setSearchPhone(limitedNumbers); // Salva apenas os números
  };

  // MELHORIA 1: Limpeza inteligente
  const handleSearch = async () => {
    // Limpar resultados anteriores e seleção antes da busca
    setSelectedOffer('');
    setShowConfirmDialog(false);
    setIsProcessingRedeem(false);
    
    await onSearch();
  };

  // MELHORIA 4: Prevenção de cliques duplos + MELHORIA 3: Confirmação dupla
  const handleRedeemClick = () => {
    if (isProcessingRedeem) return;
    setShowConfirmDialog(true);
  };

  const handleConfirmRedeem = async () => {
    setIsProcessingRedeem(true);
    setShowConfirmDialog(false);
    
    try {
      await onRedeemPoints();
    } finally {
      setIsProcessingRedeem(false);
    }
  };

  const handleCancelRedeem = () => {
    setShowConfirmDialog(false);
  };

  // Filtrar apenas ofertas disponíveis (quantity > 0)
  const availableOffers = offers.filter(offer => offer.quantity > 0);
  
  // Verificar se a oferta selecionada ainda está disponível
  const selectedOfferData = offers.find(o => o.id === selectedOffer);
  const isSelectedOfferAvailable = selectedOfferData && selectedOfferData.quantity > 0;

  // MELHORIA 2: Verificar pontos suficientes
  const hasEnoughPoints = (offer: Offer) => {
    return foundUser ? foundUser.points >= offer.points : false;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Buscar Cliente</h2>
      
      <div className="flex mb-4">
        <input
          type="tel"
          placeholder="(11) 99999-9999"
          value={formatPhone(searchPhone)} // Mostra formatado mas salva apenas números
          onChange={handlePhoneChange}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
          maxLength={16} // Máximo para formato "(11) 9 9999-9999"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-[#003F25] text-white px-4 py-2 rounded-r-md hover:bg-[#002918] transition duration-200 flex items-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Buscar
            </>
          )}
        </button>
      </div>

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
        <div className="border border-gray-200 rounded-md p-4 mb-4">
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

          <h3 className="text-[#003F25] font-semibold mb-2">Ofertas Disponíveis para Resgate</h3>
          
          <div className="mb-4">
            <div className="space-y-2">
              {/* MELHORIA 2: Aplicar validação de pontos suficientes */}
              {availableOffers.map((offer) => {
                const hasPoints = hasEnoughPoints(offer);
                return (
                  <div 
                    key={offer.id} 
                    className={`border rounded-md p-3 transition-colors ${
                      !hasPoints 
                        ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                        : selectedOffer === offer.id 
                          ? 'border-[#003F25] bg-green-50 cursor-pointer' 
                          : 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                    }`}
                    onClick={() => hasPoints && setSelectedOffer(offer.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className={`font-medium ${!hasPoints ? 'text-gray-500' : ''}`}>
                          {offer.title}
                        </h4>
                        <p className={`text-sm ${!hasPoints ? 'text-gray-400' : 'text-gray-500'}`}>
                          {offer.description}
                        </p>
                        
                        {/* MELHORIA 2: Mostrar status de pontos */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`font-semibold ${
                            !hasPoints ? 'text-gray-500' : 'text-[#003F25]'
                          }`}>
                            {offer.points} pontos
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            offer.quantity > 10 
                              ? 'bg-green-100 text-green-700'
                              : offer.quantity > 5
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-orange-100 text-orange-700'
                          }`}>
                            {offer.quantity} restantes
                          </span>
                          {/* MELHORIA 2: Indicador de pontos insuficientes */}
                          {!hasPoints && (
                            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                              Pontos insuficientes (tem {foundUser.points}, precisa {offer.points})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {availableOffers.length === 0 && (
                <div className="text-center py-6">
                  {offers.length === 0 ? (
                    <p className="text-gray-500">
                      Nenhuma oferta cadastrada. Por favor, adicione ofertas na aba Ofertas.
                    </p>
                  ) : (
                    <p className="text-gray-500">
                      Todas as ofertas estão esgotadas. Por favor, reponha o estoque na aba Ofertas.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Validar se oferta ainda está disponível E se tem pontos suficientes */}
          {selectedOffer && isSelectedOfferAvailable && hasEnoughPoints(selectedOfferData!) && (
            <div className="bg-gray-100 p-3 rounded-md mb-4">
              <p className="text-center font-medium">
                Pontos a resgatar: <span className="text-[#003F25]">
                  {selectedOfferData?.points || 0}
                </span>
              </p>
              <p className="text-center text-sm text-gray-600 mt-1">
                Quantidade restante após resgate: <span className="font-medium">
                  {(selectedOfferData?.quantity || 1) - 1}
                </span>
              </p>
            </div>
          )}

          {/* Aviso se oferta selecionada não está mais disponível */}
          {selectedOffer && !isSelectedOfferAvailable && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              A oferta selecionada não está mais disponível. Por favor, selecione outra oferta.
            </div>
          )}

          {/* MELHORIA 2: Aviso se oferta selecionada não tem pontos suficientes */}
          {selectedOffer && isSelectedOfferAvailable && !hasEnoughPoints(selectedOfferData!) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Pontos insuficientes para esta oferta. Cliente tem {foundUser.points} pontos, mas precisa de {selectedOfferData!.points} pontos.
            </div>
          )}

          <button
            onClick={handleRedeemClick}
            disabled={
              loading || 
              isProcessingRedeem || 
              !selectedOffer || 
              !isSelectedOfferAvailable || 
              availableOffers.length === 0 ||
              (selectedOfferData && !hasEnoughPoints(selectedOfferData))
            }
            className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading || isProcessingRedeem ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : !selectedOffer ? (
              'Selecione uma oferta'
            ) : !isSelectedOfferAvailable ? (
              'Oferta não disponível'
            ) : selectedOfferData && !hasEnoughPoints(selectedOfferData) ? (
              'Pontos insuficientes'
            ) : availableOffers.length === 0 ? (
              'Nenhuma oferta disponível'
            ) : (
              'Confirmar Resgate'
            )}
          </button>
        </div>
      )}

      {/* MELHORIA 3: Diálogo de confirmação dupla */}
      {showConfirmDialog && selectedOfferData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-[#003F25] mb-4">Confirmar Resgate</h3>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                <strong>Cliente:</strong> {foundUser?.name}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Oferta:</strong> {selectedOfferData.title}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Pontos a resgatar:</strong> {selectedOfferData.points}
              </p>
              <p className="text-gray-700">
                <strong>Pontos restantes:</strong> {(foundUser?.points || 0) - selectedOfferData.points}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelRedeem}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 px-4 py-2 bg-[#003F25] text-white rounded-md hover:bg-[#002918] transition duration-200"
              >
                Confirmar Resgate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTab;