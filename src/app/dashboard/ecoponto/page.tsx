// src/app/dashboard/ecoponto/page.tsx - FIX FINAL PARA QUANTIDADE

"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCountingMode } from '@/hooks/useCountingMode';
import { 
  Material, 
  Transaction, 
  UserData, 
  EcoPointTabType,
  TransactionData,
  EcoPointStats
} from '@/types/ecoponto';
import { materialService } from '@/services/materialService';
import { transactionService } from '@/services/transactionService';
import { ecoPointService } from '@/services/ecoPointService';
import { operatorService } from '@/services/operatorService';
import { userService } from '@/services/userService';

// Componentes
import SearchTab from '@/components/ecoponto/SearchTab';
import HistoryTab from '@/components/ecoponto/HistoryTab';
import StatsTab from '@/components/ecoponto/StatsTab';
import ProfileTab from '@/components/ecoponto/ProfileTab';
import BottomNavigation from '@/components/ecoponto/BottomNavigation';

export default function EcoPontoDashboardPage() {
  const { user, isAuthenticated, findUserByPhone, logout, isLoading } = useAuth();
  const { 
    mode, 
    loading: modeLoading, 
    isWeight, 
    getLabel, 
    getInputLabel 
  } = useCountingMode();
  
  const [searchPhone, setSearchPhone] = useState('');
  const [foundUser, setFoundUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('');
  const [weight, setWeight] = useState<string>(''); // ← USADO PARA AMBOS OS MODOS
  const [activeTab, setActiveTab] = useState<EcoPointTabType>('search');
  const [recentUsers, setRecentUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [ecoPointId, setEcoPointId] = useState<string>('');
  const [ecoPointName, setEcoPointName] = useState<string>('');
  const [statsData, setStatsData] = useState<EcoPointStats>({
    totalRecycledToday: 0,
    pointsDistributed: 0,
    usersServed: 0,
    mostRecycledMaterial: null,
    materialDistribution: [],
    counting_mode: 'weight',
    unit_label: 'kg'
  });
  
  const router = useRouter();

  // Verificar autenticação
  useEffect(() => {
    if (isLoading || modeLoading) return;
    
    if (!isAuthenticated) {
      console.log('Usuário não autenticado, redirecionando para login...');
      router.push('/login');
      return;
    }
    
    if (user?.userType !== 'ecoponto') {
      console.log(`Usuário tipo ${user?.userType}, redirecionando...`);
      router.push(`/dashboard/${user?.userType}`);
      return;
    }
    
    console.log('Usuário autenticado e é operador de ecoponto, continuando...');
  }, [isAuthenticated, user, router, isLoading, modeLoading]);

  // Buscar EcoPoint do operador
  useEffect(() => {
    if (isLoading || modeLoading || !isAuthenticated || user?.userType !== 'ecoponto') return;
    
    const fetchEcoPointId = async () => {
      try {
        const ecoPoint = await operatorService.getOperatorEcoPoint();
        setEcoPointId(ecoPoint.id);
        setEcoPointName(ecoPoint.name || 'Eco Ponto');
        console.log(`EcoPonto encontrado: ${ecoPoint.name} (ID: ${ecoPoint.id})`);
      } catch (error) {
        console.error('Erro ao buscar ID do ecoponto:', error);
        setEcoPointId('1');
        setEcoPointName('Eco Ponto');
      }
    };

    fetchEcoPointId();
  }, [isAuthenticated, user, isLoading, modeLoading]);

  // Carregar dados iniciais
  useEffect(() => {
    if (isLoading || modeLoading || !isAuthenticated || user?.userType !== 'ecoponto' || !ecoPointId) return;
    
    const loadInitialData = async () => {
      setLoading(true);
      try {
        console.log(`Carregando dados para o EcoPonto ID: ${ecoPointId}, Modo: ${mode}`);
        
        // Carregar materiais
        const materialsData = await materialService.listAll();
        setMaterials(materialsData);
        console.log(`${materialsData.length} materiais carregados`);

        // Carregar transações com suporte dual mode
        const transactionsResult = await transactionService.getByEcoPoint(ecoPointId);
        setTransactions(transactionsResult.transactions || []);
        console.log(`${transactionsResult.transactions?.length || 0} transações carregadas`);

        // Carregar estatísticas com suporte dual mode
        const statsData = await transactionService.getEcoPointStats(ecoPointId);
        setStatsData(statsData);
        
        // Extrair usuários recentes das transações
        await loadRecentUsers(transactionsResult.transactions || []);
        
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setError('Erro ao carregar dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [isAuthenticated, user, ecoPointId, isLoading, modeLoading, mode]);

  // Função para carregar usuários recentes
  const loadRecentUsers = async (transactionsData: Transaction[]) => {
    try {
      const userIds = Array.from(new Set(transactionsData.map((t: any) => t.userId)));
      const uniqueUsers: UserData[] = [];
      
      for (const userId of userIds.slice(0, 5)) {
        try {
          const userResponse = await userService.getById(String(userId));
          uniqueUsers.push({
            id: userResponse.id,
            name: userResponse.name,
            phone: userResponse.phone,
            userType: userResponse.userType,
            points: userResponse.points
          });
        } catch (userError) {
          const transaction = transactionsData.find((t: any) => t.userId === userId);
          if (transaction) {
            uniqueUsers.push({
              id: String(userId),
              name: transaction.userName,
              phone: transaction.userPhone,
              userType: 'comum',
              points: 0
            });
          }
        }
      }
      
      setRecentUsers(uniqueUsers);
      console.log(`${uniqueUsers.length} usuários recentes encontrados`);
    } catch (error) {
      console.error('Erro ao carregar usuários recentes:', error);
    }
  };

  // Buscar usuário pelo telefone
  const handleSearch = async (phone: string) => {
    if (!phone || phone.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setFoundUser(null);

    try {
      const result = await findUserByPhone(phone);
      
      if (result && result.userType === 'comum') {
        setFoundUser(result);
        if (!recentUsers.some(u => u.id === result.id)) {
          setRecentUsers(prev => [result, ...prev].slice(0, 5));
        }
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

  // Selecionar usuário recente
  const handleSelectRecentUser = (selectedUser: UserData) => {
    setFoundUser(selectedUser);
    setSearchPhone(selectedUser.phone);
    setError('');
    setSuccess('');
  };

  // ← FUNÇÃO ATUALIZADA PARA DUAL MODE (USANDO APENAS weight)
  const calculatePoints = (): number => {
    if (!selectedMaterial || !materials.length || !weight) return 0;
    
    const material = materials.find(m => String(m.id) === String(selectedMaterial));
    if (!material) return 0;
    
    const numericValue = parseFloat(weight.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) return 0;
    
    // Cálculo baseado no modo atual
    if (isWeight) {
      return Math.round(numericValue * material.pointsPerKg);
    } else {
      // No modo unidade, weight contém a quantidade
      return Math.floor(numericValue) * material.pointsPerUnit;
    }
  };

  // ← FUNÇÃO ATUALIZADA PARA DUAL MODE
  const handleAddPoints = async () => {
    if (!foundUser) {
      setError('Nenhum usuário selecionado');
      return;
    }

    if (!selectedMaterial) {
      setError('Selecione um material');
      return;
    }

    if (!ecoPointId) {
      setError('ID do EcoPonto não disponível. Tente novamente em instantes.');
      return;
    }

    // ← VALIDAÇÃO ATUALIZADA (usando apenas weight)
    if (!weight || parseFloat(weight.replace(',', '.')) <= 0) {
      setError(`Digite ${isWeight ? 'um peso' : 'uma quantidade'} válida`);
      return;
    }

    const pointsToAdd = calculatePoints();
    if (pointsToAdd <= 0) {
      setError('Erro ao calcular pontos');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // ← PREPARAR DADOS USANDO APENAS weight
      const numericValue = parseFloat(weight.replace(',', '.'));
      const transactionData: TransactionData = {
        userId: foundUser.id,
        materialId: selectedMaterial,
        ecoPointId: ecoPointId,
        ...(isWeight 
          ? { weight: numericValue, quantity: 0 }
          : { weight: 0, quantity: Math.floor(numericValue) } // weight contém a quantidade
        )
      };

      console.log('📊 Dados da transação:', {
        mode,
        isWeight,
        inputValue: weight,
        numericValue,
        transactionData
      });

      // Validar dados
      const validation = transactionService.validateTransactionData(transactionData, mode);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Criar transação
      const result = await transactionService.create(transactionData);
      
      // Criar nova transação para UI
      const material = materials.find(m => m.id === selectedMaterial);
      const newTransaction: Transaction = {
        id: result.transaction.id,
        userName: foundUser.name,
        userPhone: foundUser.phone,
        material: material?.name || 'Desconhecido',
        materialName: material?.name || 'Desconhecido',
        weight: result.transaction.weight,
        quantity: result.transaction.quantity,
        points: result.transaction.points,
        date: result.transaction.date
      };
      
      // Atualizar estado local
      setTransactions(prev => [newTransaction, ...prev]);
      setFoundUser(result.user);
      
      setSuccess(
        `${result.transaction.points} pontos adicionados com sucesso para ${foundUser.name}! ` +
        `(${isWeight ? `${numericValue}kg` : `${Math.floor(numericValue)} ${getLabel()}`})`
      );
      
      // Atualizar usuários recentes
      setRecentUsers(prev => 
        prev.map(u => 
          u.id === foundUser.id 
            ? { ...u, points: result.user.points } 
            : u
        )
      );
      
      // ← LIMPAR APENAS weight
      setSelectedMaterial('');
      setWeight('');
      
      // Recarregar estatísticas
      const updatedStats = await transactionService.getEcoPointStats(ecoPointId);
      setStatsData(updatedStats);
      
    } catch (error: any) {
      console.error('❌ Erro completo:', error);
      if (error.response?.data?.message) {
        setError(`Erro: ${error.response.data.message}`);
      } else {
        setError('Erro ao adicionar pontos. Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handler para mudança de aba
  const handleTabChange = (tab: EcoPointTabType) => {
    setActiveTab(tab);
  };

  // Loading states
  if (isLoading || modeLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25] mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">
            {isLoading ? 'Verificando autenticação...' : 'Carregando configurações...'}
          </p>
          <p className="text-gray-500 text-sm mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Estado de carregamento dos dados
  if (!user || !ecoPointId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003F25] mb-4 mx-auto"></div>
          <p className="text-gray-600 font-medium">Carregando informações do Eco Ponto...</p>
          <p className="text-gray-500 text-sm mt-2">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <SearchTab 
            materials={materials}
            recentUsers={recentUsers}
            loading={loading}
            error={error}
            success={success}
            onSearchUser={handleSearch}
            onSelectRecentUser={handleSelectRecentUser}
            onAddPoints={handleAddPoints}
            foundUser={foundUser}
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            weight={weight}
            setWeight={setWeight}
            calculatePoints={calculatePoints}
          />
        );
      case 'history':
        return <HistoryTab transactions={transactions} />;
      case 'stats':
        return <StatsTab statsData={statsData} />;
      case 'profile':
        return <ProfileTab user={user} onLogout={logout} />;
      default:
        return (
          <SearchTab 
            materials={materials}
            recentUsers={recentUsers}
            loading={loading}
            error={error}
            success={success}
            onSearchUser={handleSearch}
            onSelectRecentUser={handleSelectRecentUser}
            onAddPoints={handleAddPoints}
            foundUser={foundUser}
            searchPhone={searchPhone}
            setSearchPhone={setSearchPhone}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            weight={weight}
            setWeight={setWeight}
            calculatePoints={calculatePoints}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Cabeçalho original mantido */}
      <div className="bg-[#FBCA27] rounded-lg p-4 shadow-md mb-6">
        <h1 className="text-[#003F25] text-xl font-bold text-center">{ecoPointName}</h1>
        <p className="text-center text-[#003F25]">Operador: {user.name}</p>
      </div>

      {/* Conteúdo principal baseado na aba ativa */}
      {renderContent()}

      {/* Navegação inferior */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}