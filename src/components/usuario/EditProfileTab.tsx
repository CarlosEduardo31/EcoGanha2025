// src/components/usuario/EditProfileTab.tsx - SIMPLIFICADO

import React, { useState, useEffect } from 'react';
import { User } from '@/contexts/AuthContext';
import { UserTabType } from '@/types/comum';
import { userService } from '@/services/userService';

interface EditProfileTabProps {
  user: User;
  onTabChange: (tab: UserTabType) => void;
  onProfileUpdate: (updatedUser: Partial<User>) => void;
}

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
  age?: number;
  address?: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface FormData {
  name: string;
  age: string;
}

const EditProfileTab: React.FC<EditProfileTabProps> = ({ 
  user, 
  onTabChange, 
  onProfileUpdate 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: ''
  });

  // Carregar dados do perfil completo
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const profile = await userService.getProfile();
        setProfileData(profile);
        
        // Preencher o formulário apenas com nome e idade
        setFormData({
          name: profile.name || '',
          age: profile.age ? profile.age.toString() : ''
        });
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Atualizar dados do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulário
  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Nome é obrigatório';
    }
    
    if (!formData.age.trim()) {
      return 'Idade é obrigatória';
    }
    
    const age = parseInt(formData.age);
    if (isNaN(age)) {
      return 'Por favor, digite uma idade válida 😊';
    }
    
    if (age < 1) {
      return 'Ops! A idade deve ser pelo menos 1 ano 👶';
    }
    
    if (age > 120) {
      return 'Humm... que tal uma idade um pouco menor? Máximo 120 anos 👴👵';
    }
    
    return null;
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Enviar apenas o nome para a API (API atual não suporta idade)
      const updateData = {
        name: formData.name.trim()
      };

      const updatedProfile = await userService.updateProfile(updateData);
      
      // Atualizar o contexto com nome e idade (idade fica apenas local por enquanto)
      onProfileUpdate({ 
        name: updatedProfile.name,
        age: parseInt(formData.age) // Atualização local da idade
      });
      
      setSuccess('Perfil atualizado com sucesso! ✨');
      
      // Voltar para o perfil após 3 segundos para dar tempo de ver a mensagem
      setTimeout(() => {
        onTabChange('profile');
      }, 3000);

    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Dados inválidos. Verifique as informações e tente novamente.');
      } else {
        setError('Erro ao atualizar perfil. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#003F25] mb-4"></div>
        <p className="text-gray-600">Carregando dados do perfil...</p>
      </div>
    );
  }

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
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-[#003F25] font-semibold text-lg mb-6">Editar Perfil</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-400 text-green-800 px-6 py-4 rounded-lg mb-6 flex items-center shadow-lg transform transition-all duration-500 animate-pulse">
              <div className="bg-green-500 rounded-full p-2 mr-4 flex-shrink-0 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-grow">
                <div className="font-bold text-lg mb-1">🎉 {success}</div>
                <div className="text-sm text-green-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Redirecionando você de volta ao perfil...
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Editáveis */}
            <div className="border-b pb-6">
              <h3 className="text-[#003F25] font-medium text-lg mb-4">Informações Editáveis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Idade *
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                    placeholder="Ex: 25"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informações Fixas */}
            <div className="border-b pb-6">
              <h3 className="text-[#003F25] font-medium text-lg mb-4">Informações da Conta</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={profileData?.phone || ''}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para alterar o telefone, entre em contato conosco
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pontos Acumulados
                  </label>
                  <input
                    type="text"
                    value={`${profileData?.points || 0} EcoPontos`}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Endereço (apenas visualização) */}
            <div className="pb-6">
              <h3 className="text-[#003F25] font-medium text-lg mb-4">Endereço Cadastrado</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logradouro
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.street || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.number || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.complement || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.neighborhood || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.city || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.state || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={profileData?.address?.zipCode || 'Não informado'}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed text-gray-600"
                    disabled
                  />
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-3">
                Para alterar o endereço, entre em contato conosco
              </p>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => onTabChange('profile')}
                className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full sm:w-auto py-2 px-6 rounded-md transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center ${
                  loading 
                    ? 'bg-gray-400 text-gray-200' 
                    : 'bg-[#003F25] text-white hover:bg-[#002918] hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando suas informações...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileTab;