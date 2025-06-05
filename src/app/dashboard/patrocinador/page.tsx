// src/pages/dashboard/patrocinador.tsx

"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SponsorTabType, UserData, Offer, Redemption } from '@/types/patrocinador';
import { offerService } from '@/services/offerService';
import { redemptionService } from '@/services/redemptionService';

// Componentes
import SearchTab from '@/components/patrocinador/SearchTab';
import HistoryTab from '@/components/patrocinador/HistoryTab';
import OffersTab from '@/components/patrocinador/OffersTab';
import ProfileTab from '@/components/patrocinador/ProfileTab';
import BottomNavigation from '@/components/patrocinador/BottomNavigation';

export default function PatrocinadorDashboardPage() {
  const { user, isAuthenticated, logout, findUserByPhone, removePoints, isLoading } = useAuth();
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedOffer, setSelectedOffer] = useState<string>('');
  const [activeTab, setActiveTab] = useState<SponsorTabType>('search');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const router = useRouter();

 // Verificar autenticação APENAS quando não estiver carregando
  useEffect(() => {
    // Se ainda está carregando, não fazer nada
    if (isLoading) return;
    
    // Se terminou de carregar e não está autenticado, redirecionar
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login...');
      router.push('/login');
      return;
    }
    
    // Se está autenticado mas não é patrocinador, redirecionar
    if (user?.userType !== 'patrocinador') {
      console.log(`Usuário tipo ${user?.userType}, redirecionando...`);
      router.push(`/dashboard/${user?.userType}`);
      return;
    }
    
    console.log('Usuário autenticado e é patrocinador, continuando...');
  }, [isAuthenticated, user, router, isLoading]);

  // Carregar dados iniciais
 useEffect(() => {
    // ← AGUARDAR autenticação estar completa antes de carregar dados
    if (isLoading || !isAuthenticated || user?.userType !== 'patrocinador') return;
    
    const loadInitialData = async () => {
      try {
        console.log('Carregando dados do patrocinador...');

        // Carregar ofertas do parceiro
        const offersData = await offerService.listPartnerOffers();
        setOffers(offersData);
        console.log(`${offersData.length} ofertas carregadas`);

        // Carregar histórico de resgates
        const redemptionsData = await redemptionService.getPartnerRedemptions();
        setRedemptions(redemptionsData);
        console.log(`${redemptionsData.length} resgates carregados`);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, isLoading]);

  // Buscar usuário pelo telefone
  const handleSearch = async () => {
    if (!searchPhone || searchPhone.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFoundUser(null);
    setSelectedOffer('');

    try {
      const result = await findUserByPhone(searchPhone);
      
      if (result && result.userType === 'comum') {
        setFoundUser(result);
      } else {
        setError('Usuário não encontrado ou não é um usuário comum');
      }
    } catch (error) {
      setError('Erro ao buscar usuário');
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  // Selecionar um usuário recente
  const handleSelectRecentUser = (selectedUser: UserData) => {
    setFoundUser(selectedUser);
    setSearchPhone(selectedUser.phone);
    setError('');
    setSuccess('');
    setSelectedOffer('');
  };

  // Resgatar pontos - ATUALIZADO para lidar com quantidade
  const handleRedeemPoints = async () => {
    if (!foundUser) {
      setError('Nenhum usuário selecionado');
      return;
    }

    if (!selectedOffer) {
      setError('Selecione uma oferta');
      return;
    }

    const offer = offers.find(o => o.id === selectedOffer);
    if (!offer) {
      setError('Oferta inválida');
      return;
    }

    // NOVA VALIDAÇÃO: Verificar se oferta ainda tem estoque
    if (offer.quantity <= 0) {
      setError('Esta oferta não está mais disponível (estoque esgotado)');
      return;
    }

    if (foundUser.points < offer.points) {
      setError(`Pontos insuficientes. O usuário tem ${foundUser.points} pontos, mas a oferta requer ${offer.points} pontos.`);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Chamar serviço para registrar o resgate
      const redemptionResult = await redemptionService.create({
        userId: foundUser.id,
        offerId: selectedOffer
      });
      
      // ATUALIZADO: Decrementar quantidade da oferta na UI imediatamente
      setOffers(prev => prev.map(o => 
        o.id === selectedOffer 
          ? { ...o, quantity: Math.max(0, o.quantity - 1) }
          : o
      ));
      
      // Buscar usuário atualizado para obter os pontos atualizados
      const updatedUser = await findUserByPhone(foundUser.phone);
      
      // Criar novo resgate para atualizar a UI imediatamente
      const newRedemption = {
        id: Date.now().toString(),
        userId: foundUser.id,
        userName: foundUser.name,
        userPhone: foundUser.phone,
        offerId: selectedOffer,
        offerTitle: offer.title,
        points: offer.points,
        date: new Date().toISOString()
      };
      
      setRedemptions(prev => [newRedemption, ...prev]);
      
      // ATUALIZADO: Mensagem incluindo informação sobre quantidade restante
      const remainingQuantity = Math.max(0, offer.quantity - 1);
      setSuccess(
        `Resgate bem-sucedido! ${offer.points} pontos foram descontados do usuário ${foundUser.name}. ` +
        `${remainingQuantity > 0 ? `Restam ${remainingQuantity} unidades desta oferta.` : 'Esta oferta está esgotada.'}`
      );
      
      // Atualizar o usuário encontrado
      if (updatedUser) {
        setFoundUser(updatedUser);
      } else {
        // Se não conseguir buscar o usuário atualizado, atualiza manualmente
        setFoundUser(prev => {
          if (!prev) return null;
          return {
            ...prev,
            points: prev.points - offer.points
          };
        });
      }
      
      // Limpar seleção se a oferta ficou esgotada
      if (remainingQuantity <= 0) {
        setSelectedOffer('');
      }
      
    } catch (error: any) {
      // Lidar com erros específicos da API
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Erro ao processar resgate');
      }
      console.error('Erro ao processar resgate:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gerenciar ofertas - ATUALIZADO para incluir quantidade
  const handleAddOffer = async (offer: Omit<Offer, 'id'>) => {
    try {
      const newOffer = await offerService.create(offer);
      setOffers(prev => [...prev, newOffer]);
    } catch (error) {
      console.error('Erro ao adicionar oferta:', error);
      throw error;
    }
  };

  const handleUpdateOffer = async (updatedOffer: Offer) => {
    try {
      await offerService.update(updatedOffer.id, updatedOffer);
      setOffers(prev => prev.map(offer => 
        offer.id === updatedOffer.id ? updatedOffer : offer
      ));
    } catch (error) {
      console.error('Erro ao atualizar oferta:', error);
      throw error;
    }
  };

  const handleDeleteOffer = async (offerId: string): Promise<void> => {
    try {
      await offerService.remove(offerId);
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
    } catch (error: any) {
      console.error('Erro ao excluir oferta:', error);
      // Re-throw o erro para que o componente possa tratá-lo
      throw error;
    }
  };

  // Handler para mudança de aba
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as SponsorTabType);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25]"></div>
      </div>
    );
  }

  // Renderiza o conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <SearchTab
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            foundUser={foundUser}
            loading={loading}
            error={error}
            success={success}
            offers={offers}
            selectedOffer={selectedOffer}
            setSelectedOffer={setSelectedOffer}
            onSearch={handleSearch}
            onRedeemPoints={handleRedeemPoints}
          />
        );
      case 'history':
        return <HistoryTab redemptions={redemptions} />;
      case 'offers':
        return (
          <OffersTab
            offers={offers}
            onAddOffer={handleAddOffer}
            onUpdateOffer={handleUpdateOffer}
            onDeleteOffer={handleDeleteOffer}
          />
        );
      case 'profile':
        return <ProfileTab user={user} onLogout={logout} />;
      default:
        return (
          <SearchTab
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            foundUser={foundUser}
            loading={loading}
            error={error}
            success={success}
            offers={offers}
            selectedOffer={selectedOffer}
            setSelectedOffer={setSelectedOffer}
            onSearch={handleSearch}
            onRedeemPoints={handleRedeemPoints}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Cabeçalho do patrocinador */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">Parceiro</h1>
        <p className="text-center text-[#003F25]">Estabelecimento: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}