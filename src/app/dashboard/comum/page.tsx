// src/app/dashboard/comum/page.tsx - CORRIGIDO

"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/contexts/AuthContext';
import { 
  UserTabType, 
  EcoPoint, 
  Partner, 
  RecycleTransaction, 
  RedemptionTransaction, 
  SelectedPartner 
} from '@/types/comum';
import { resourceService } from '@/services/resourceService';
import { userService } from '@/services/userService';

// Componentes
import HomeTab from '@/components/usuario/HomeTab';
import RewardsTab from '@/components/usuario/RewardsTab';
import EcoPointsTab from '@/components/usuario/EcoPointsTab';
import ProfileTab from '@/components/usuario/ProfileTab';
import ActivitiesTab from '@/components/usuario/ActivitiesTab';
import RedemptionsTab from '@/components/usuario/RedemptionsTab';
import EditProfileTab from '@/components/usuario/EditProfileTab';
import BottomNavigation from '@/components/layout/BottomNavigationComun';

export default function UsuarioComumPage() {
  const { user, isAuthenticated, logout, updateUserData, isLoading } = useAuth(); // ← ADICIONAR isLoading
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserTabType>('home');
  const [selectedPartner, setSelectedPartner] = useState<SelectedPartner | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Estados dos dados
  const [recycleHistory, setRecycleHistory] = useState<RecycleTransaction[]>([]);
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionTransaction[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [ecoPoints, setEcoPoints] = useState<EcoPoint[]>([]);

  // ← CORREÇÃO PRINCIPAL: Aguardar loading do AuthContext terminar
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
    
    // Se está autenticado mas não é usuário comum, redirecionar
    if (user?.userType !== 'comum') {
      console.log(`Usuário tipo ${user?.userType}, redirecionando...`);
      router.push(`/dashboard/${user?.userType}`);
      return;
    }
    
    console.log('Usuário autenticado e é do tipo comum, continuando...');
  }, [isAuthenticated, user, router, isLoading]); // ← ADICIONAR isLoading na dependência

  // Carregar dados iniciais
  useEffect(() => {
    // ← AGUARDAR autenticação estar completa antes de carregar dados
    if (isLoading || !isAuthenticated || user?.userType !== 'comum') return;
    
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log('Carregando dados do usuário comum...');

        // Carregar histórico de reciclagem
        try {
          const recycleData = await userService.getRecycleHistory();
          setRecycleHistory(recycleData || []);
          console.log(`${recycleData?.length || 0} transações de reciclagem carregadas`);
        } catch (error) {
          console.error('Erro ao carregar histórico de reciclagem:', error);
          setRecycleHistory([]);
        }

        // Carregar histórico de resgates
        try {
          const redemptionData = await userService.getRedemptionHistory();
          setRedemptionHistory(redemptionData || []);
          console.log(`${redemptionData?.length || 0} resgates carregados`);
        } catch (error) {
          console.error('Erro ao carregar histórico de resgates:', error);
          setRedemptionHistory([]);
        }

        // Carregar parceiros e ofertas
        try {
          const partnersData = await resourceService.getOffers();
          setPartners(partnersData || []);
          console.log(`${partnersData?.length || 0} parceiros carregados`);
        } catch (error) {
          console.error('Erro ao carregar parceiros:', error);
          setPartners([]);
        }

        // Carregar eco pontos
        try {
          const ecoPointsData = await resourceService.getEcoPoints();
          setEcoPoints(ecoPointsData || []);
          console.log(`${ecoPointsData?.length || 0} ecopontos carregados`);
        } catch (error) {
          console.error('Erro ao carregar ecopontos:', error);
          setEcoPoints([]);
        }

      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, isLoading]); // ← ADICIONAR isLoading na dependência

   // Handler para mudança de aba
  const handleTabChange = (tab: UserTabType) => {
    setActiveTab(tab);
    if (tab === 'rewards' && selectedPartner) {
      setSelectedPartner(null);
    }
  };

  // Handler para atualização de perfil
  const handleProfileUpdate = (updatedData: Partial<User>) => {
    if (updateUserData && user) {
      updateUserData(updatedData);
    }
  };

  // ← MOSTRAR LOADING ENQUANTO AuthContext está verificando autenticação
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25] mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Verificando autenticação...</p>
          <p className="text-gray-500 text-sm mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Estado de carregamento dos dados
  if (!user || loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25] mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Carregando seus dados...</p>
          <p className="text-gray-500 text-sm mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Renderiza o conteúdo com base na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab 
            user={user} 
            recycleHistory={recycleHistory}
            partners={partners}
            onTabChange={handleTabChange} 
            setSelectedPartner={setSelectedPartner} 
          />
        );
      case 'rewards':
        return (
          <RewardsTab 
            user={user} 
            partners={partners}
            selectedPartner={selectedPartner} 
            setSelectedPartner={setSelectedPartner}
            onTabChange={handleTabChange}
          />
        );
      case 'map':
        return <EcoPointsTab ecoPoints={ecoPoints} onTabChange={handleTabChange} />;
      case 'profile':
        return (
          <ProfileTab 
            user={user} 
            onTabChange={handleTabChange} 
            onLogout={logout} 
          />
        );
      case 'activities':
        return (
          <ActivitiesTab 
            user={user} 
            recycleHistory={recycleHistory} 
            onTabChange={handleTabChange} 
          />
        );
      case 'redemptions':
        return (
          <RedemptionsTab 
            user={user} 
            redemptionHistory={redemptionHistory} 
            onTabChange={handleTabChange} 
          />
        );
      case 'editProfile':
        return (
          <EditProfileTab 
            user={user} 
            onTabChange={handleTabChange} 
            onProfileUpdate={handleProfileUpdate}
          />
        );
      default:
        return (
          <HomeTab 
            user={user} 
            recycleHistory={recycleHistory}
            partners={partners}
            onTabChange={handleTabChange} 
            setSelectedPartner={setSelectedPartner} 
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior - esconder apenas quando editando perfil */}
      {activeTab !== 'editProfile' && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}