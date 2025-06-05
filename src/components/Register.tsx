"use client"
import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import authService from '@/services/authService';

// Tipos para o formulário
interface FormData {
  // Dados pessoais
  nome: string;
  telefone: string;
  idade: string; // ← NOVO CAMPO
  senha: string;
  confirmSenha: string;
  
  // Dados de endereço
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  // REMOVIDO: referencia
}

export function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  // NOVOS ESTADOS para LGPD
  const [consentGiven, setConsentGiven] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    idade: '', // ← NOVO CAMPO
    senha: '',
    confirmSenha: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
    // REMOVIDO: referencia
  });

  // Estados brasileiros
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];

  // Atualizar dados do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formatar telefone
  const formatPhone = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= 2) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2)}`;
    } else if (numericValue.length <= 10) {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 6)}-${numericValue.slice(6)}`;
    } else {
      return `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
    }
  };

  // Formatar CEP
  const formatCEP = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue.length <= 5) {
      return numericValue;
    } else {
      return `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`;
    }
  };

  // Lidar com a entrada de telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setFormData(prev => ({
      ...prev,
      telefone: formattedValue
    }));
  };

  // Lidar com a entrada de CEP
  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCEP(e.target.value);
    setFormData(prev => ({
      ...prev,
      cep: formattedValue
    }));
  };

  // Buscar endereço pelo CEP
  const fetchAddressByCEP = async () => {
    if (formData.cep.length < 8) return;
    
    const cepNumerico = formData.cep.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        setError('CEP não encontrado');
      } else {
        setFormData(prev => ({
          ...prev,
          logradouro: data.logradouro || prev.logradouro,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setError('Erro ao buscar CEP. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Validar o primeiro passo (dados pessoais) - ATUALIZADO
  const validateStep1 = (): boolean => {
    if (!formData.nome.trim()) {
      setError('Nome é obrigatório');
      return false;
    }
    
    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
      setError('Telefone válido é obrigatório (com DDD)');
      return false;
    }
    
    // ← NOVA VALIDAÇÃO DE IDADE
    if (!formData.idade.trim()) {
      setError('Idade é obrigatória');
      return false;
    }
    
    const age = parseInt(formData.idade);
    if (isNaN(age) || age < 13 || age > 120) {
      setError('Idade deve ser entre 13 e 120 anos');
      return false;
    }
    
    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (formData.senha !== formData.confirmSenha) {
      setError('As senhas não coincidem');
      return false;
    }
    
    setError('');
    return true;
  };

  // Validar o segundo passo (endereço) - ATUALIZADO
  const validateStep2 = (): boolean => {
    if (!formData.cep.trim() || formData.cep.replace(/\D/g, '').length !== 8) {
      setError('CEP válido é obrigatório');
      return false;
    }
    
    if (!formData.logradouro.trim()) {
      setError('Logradouro é obrigatório');
      return false;
    }
    
    if (!formData.numero.trim()) {
      setError('Número é obrigatório');
      return false;
    }
    
    if (!formData.bairro.trim()) {
      setError('Bairro é obrigatório');
      return false;
    }
    
    if (!formData.cidade.trim()) {
      setError('Cidade é obrigatória');
      return false;
    }
    
    if (!formData.estado.trim()) {
      setError('Estado é obrigatório');
      return false;
    }
    
    // ← NOVA VALIDAÇÃO DE CONSENTIMENTO
    if (!consentGiven) {
      setError('É necessário aceitar os termos de uso e política de privacidade');
      return false;
    }
    
    setError('');
    return true;
  };

  // Avançar para o próximo passo
  const goToNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  // Voltar para o passo anterior
  const goToPreviousStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Enviar o formulário - ATUALIZADO
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
      return;
    }
    
    if (!validateStep2()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // ← DADOS ATUALIZADOS com idade e consentimento
      const userData = {
        name: formData.nome,
        phone: formData.telefone.replace(/\D/g, ''),
        password: formData.senha,
        userType: 'comum',
        age: parseInt(formData.idade), // ← INCLUIR IDADE
        consentGiven, // ← INCLUIR CONSENTIMENTO
        address: {
          street: formData.logradouro,
          number: formData.numero,
          complement: formData.complemento,
          neighborhood: formData.bairro,
          city: formData.cidade,
          state: formData.estado,
          zipCode: formData.cep.replace(/\D/g, '')
          // REMOVIDO: reference
        }
      };

      console.log('Dados sendo enviados:', userData);
      
      const user = await authService.register(userData);
      
      setSuccess('Cadastro realizado com sucesso!');

      if (user) {
        if (user.userType === 'comum') {
          window.location.href = '/dashboard/comum';
        } else if (user.userType === 'ecoponto') {
          window.location.href = '/dashboard/ecoponto';
        } else if (user.userType === 'patrocinador') {
          window.location.href = '/dashboard/patrocinador';
        } else {
          window.location.href = '/dashboard';
        }
      }
    
    } catch (error: any) {
      console.error('Erro completo no cadastro:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Dados inválidos. Verifique as informações e tente novamente.');
      } else if (error.response?.status === 409) {
        setError('Este telefone já está cadastrado.');
      } else if (error.request) {
        setError('Servidor indisponível. Tente novamente mais tarde.');
      } else {
        setError('Erro ao processar sua solicitação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logoSVG.png"
          alt="EcoGanha Logo"
          width={120}
          height={120}
          className="w-24 h-24 sm:w-28 sm:h-28"
        />
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#FBCA27] py-4">
          <h2 className="text-center text-[#003F25] font-semibold text-xl">Cadastro no EcoGanha</h2>
        </div>
        
        {/* Indicador de Progresso */}
        <div className="px-6 pt-4">
          <div className="flex items-center mb-4">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-[#003F25] text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              currentStep >= 2 ? 'bg-[#003F25]' : 'bg-gray-300'
            }`}></div>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-[#003F25] text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between px-1 text-xs text-gray-600 mb-2">
            <span>Dados Pessoais</span>
            <span>Endereço e Termos</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          {/* Passo 1: Dados Pessoais - ATUALIZADO */}
          {currentStep === 1 && (
            <>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                />
              </div>

              {/* ← NOVO CAMPO DE IDADE */}
              <div>
                <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  id="idade"
                  name="idade"
                  type="number"
                  min="13"
                  max="120"
                  placeholder="Ex: 25"
                  value={formData.idade}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Idade mínima: 13 anos</p>
              </div>
              
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo de 6 caracteres"
                  value={formData.senha}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmSenha" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha
                </label>
                <input
                  id="confirmSenha"
                  name="confirmSenha"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Digite sua senha novamente"
                  value={formData.confirmSenha}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                />
              </div>
            </>
          )}
          
          {/* Passo 2: Endereço e Termos - ATUALIZADO */}
          {currentStep === 2 && (
            <>
              <div>
                <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <div className="flex">
                  <input
                    id="cep"
                    name="cep"
                    type="text"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={handleCEPChange}
                    onBlur={fetchAddressByCEP}
                    className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                    required
                    maxLength={9}
                  />
                  <button
                    type="button"
                    onClick={fetchAddressByCEP}
                    className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md hover:bg-gray-300 transition duration-200"
                    disabled={loading}
                  >
                    {loading ? '...' : 'Buscar'}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700 mb-1">
                  Logradouro
                </label>
                <input
                  id="logradouro"
                  name="logradouro"
                  type="text"
                  autoComplete="street-address"
                  placeholder="Rua, Avenida, etc."
                  value={formData.logradouro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    id="numero"
                    name="numero"
                    type="text"
                    placeholder="123"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                    required
                  />
                </div>
                
                <div className="w-2/3">
                  <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">
                    Complemento
                  </label>
                  <input
                    id="complemento"
                    name="complemento"
                    type="text"
                    placeholder="Apto, Bloco, etc."
                    value={formData.complemento}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">
                  Bairro
                </label>
                <input
                  id="bairro"
                  name="bairro"
                  type="text"
                  placeholder="Seu bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <div className="w-2/3">
                  <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    id="cidade"
                    name="cidade"
                    type="text"
                    autoComplete="address-level2"
                    placeholder="Sua cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                    required
                  />
                </div>
                
                <div className="w-1/3">
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                    required
                  >
                    <option value="">UF</option>
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ← NOVO: Termo de Consentimento LGPD */}
              <div className="border-t pt-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={() => setShowTerms(!showTerms)}
                      className="text-[#003F25] hover:text-[#002918] font-medium text-sm flex items-center"
                    >
                      {showTerms ? '▼' : '▶'} Termo de Consentimento para Tratamento de Dados Pessoais
                    </button>
                  </div>
                  
                  {showTerms && (
                    <div className="mt-3 text-sm text-gray-700 bg-white p-3 rounded border max-h-40 overflow-y-auto">
                      <p className="mb-3">
                        Ao preencher este formulário, você autoriza a EcoGanha a coletar e tratar seus dados pessoais, 
                        incluindo nome, endereço, telefone e idade, exclusivamente para fins de cadastro na plataforma, 
                        contato, análise de dados e demais finalidades relacionadas aos serviços oferecidos.
                      </p>
                      
                      <p className="mb-3 font-medium">Declaro estar ciente de que:</p>
                      <ul className="list-disc list-inside space-y-1 mb-3">
                        <li>Meus dados serão utilizados somente para os fins aqui descritos;</li>
                        <li>
                          Posso, a qualquer momento, solicitar a retirada do meu consentimento ou a exclusão dos meus dados, 
                          conforme previsto na Lei nº 13.709/2018 (Lei Geral de Proteção de Dados – LGPD);
                        </li>
                        <li>
                          Meus dados não serão compartilhados com terceiros sem meu consentimento prévio, 
                          salvo em casos de exigência legal.
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  <label className="flex items-start mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="w-4 h-4 text-[#003F25] bg-gray-100 border-gray-300 rounded focus:ring-[#003F25] focus:ring-2 mr-3 mt-0.5 flex-shrink-0"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      Li e concordo com os Termos de Uso e a Política de Privacidade. *
                    </span>
                  </label>
                </div>
              </div>

              {/* REMOVIDO: Campo de referência */}
            </>
          )}
          
          {/* Botões de navegação */}
          <div className="flex justify-between pt-2">
            {currentStep === 2 ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition duration-200"
              >
                Voltar
              </button>
            ) : (
              <div></div>
            )}
            
            <button
              type={currentStep === 2 ? 'submit' : 'button'}
              onClick={currentStep === 1 ? goToNextStep : undefined}
              disabled={loading}
              className="bg-[#003F25] text-white py-2 px-6 rounded-md hover:bg-[#002918] transition duration-200 flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : currentStep === 1 ? 'Continuar' : 'Cadastrar'}
            </button>
          </div>
        </form>
        
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#003F25] font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>EcoGanha - São João de Caruaru 2025</p>
      </div>
    </div>
  );
}