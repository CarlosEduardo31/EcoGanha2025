// src/components/patrocinador/SearchTab.tsx

import React from 'react';
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

  // NOVO: Função para verificar se o telefone está válido
  const isPhoneValid = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 10 || numbers.length === 11;
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

  const handleSearch = async () => {
    await onSearch();
  };

  // Filtrar apenas ofertas disponíveis (quantity > 0)
  const availableOffers = offers.filter(offer => offer.quantity > 0);
  
  // Verificar se a oferta selecionada ainda está disponível
  const selectedOfferData = offers.find(o => o.id === selectedOffer);
  const isSelectedOfferAvailable = selectedOfferData && selectedOfferData.quantity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">Buscar Cliente</h2>
      
      {/* ATUALIZADO: Layout responsivo */}
      <div className="flex flex-col sm:flex-row mb-4 gap-2 sm:gap-0">
        <input
          type="tel"
          placeholder="(11) 99999-9999"
          value={formatPhone(searchPhone)} // Mostra formatado mas salva apenas números
          onChange={handlePhoneChange}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-[#003F25]"
          maxLength={16} // Máximo para formato "(11) 9 9999-9999"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !isPhoneValid(searchPhone)} // NOVO: Validação do telefone
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
              {/* ATUALIZADO: Usar apenas ofertas disponíveis */}
              {availableOffers.map((offer) => (
                <div 
                  key={offer.id} 
                  className={`border rounded-md p-3 cursor-pointer transition-colors ${
                    selectedOffer === offer.id 
                      ? 'border-[#003F25] bg-green-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedOffer(offer.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{offer.title}</h4>
                      <p className="text-sm text-gray-500">{offer.description}</p>
                      
                      {/* NOVO: Mostrar quantidade disponível */}
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[#003F25] font-semibold">
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}

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

          {/* ATUALIZADO: Validar se oferta ainda está disponível */}
          {selectedOffer && isSelectedOfferAvailable && (
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

          {/* NOVO: Aviso se oferta selecionada não está mais disponível */}
          {selectedOffer && !isSelectedOfferAvailable && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              A oferta selecionada não está mais disponível. Por favor, selecione outra oferta.
            </div>
          )}

          <button
            onClick={onRedeemPoints}
            disabled={loading || !selectedOffer || !isSelectedOfferAvailable || availableOffers.length === 0}
            className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : !selectedOffer ? (
              'Selecione uma oferta'
            ) : !isSelectedOfferAvailable ? (
              'Oferta não disponível'
            ) : availableOffers.length === 0 ? (
              'Nenhuma oferta disponível'
            ) : (
              'Confirmar Resgate'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchTab;