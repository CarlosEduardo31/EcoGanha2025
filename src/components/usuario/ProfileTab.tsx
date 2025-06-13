// src/components/usuario/ProfileTab.tsx - COM SUPORTE WHATSAPP

import React from 'react';
import Image from 'next/image';
import { User } from '@/contexts/AuthContext';
import { UserTabType } from '@/types/comum';

interface ProfileTabProps {
  user: User;
  onTabChange: (tab: UserTabType) => void;
  onLogout: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ user, onTabChange, onLogout }) => {
  // Função para abrir WhatsApp
  const openWhatsApp = () => {
    const phoneNumber = "81991292488"; 
    const message = encodeURIComponent(
      `Olá! Sou ${user.name} e preciso de ajuda com minha conta EcoGanha. 
      
Meu telefone cadastrado: ${user.phone}
Meus pontos atuais: ${user.points} EcoPontos

Como posso ser ajudado(a)?`
    );
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center">
            <Image
              src={"/IconPerfil.svg"}
              alt="Perfil"
              width={100}
              height={100}
              className="w-24 h-24"
            />
          </div>
          <h1 className="text-[#003E25] font-semibold text-xl mt-2">{user.name}</h1>
          <p className="text-gray-500">{user.phone}</p>
          {/* Adicionar idade se disponível */}
          {(user as any).age && (
            <p className="text-gray-500 text-sm">{(user as any).age} anos</p>
          )}
          <div className="bg-[#FBCA27] rounded-full px-4 py-1 inline-block mt-2">
            <p className="text-[#003F25] font-bold">{user.points} EcoPontos</p>
          </div>
        </div>

        {/* Botão Editar Perfil */}
        <div className="mb-6">
          <button 
            onClick={() => onTabChange('editProfile')}
            className="w-full bg-[#003F25] text-white py-2 px-4 rounded-md hover:bg-[#002918] transition duration-200 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Perfil
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Históricos</h2>
            
            <div className="space-y-3">
              <button 
                onClick={() => onTabChange('activities')} 
                className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span>Histórico de Reciclagem</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button 
                onClick={() => onTabChange('redemptions')} 
                className="w-full flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="bg-[#f8efc2] p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FBCA27]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Prêmios Resgatados</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* ← NOVA SEÇÃO: Suporte */}
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Suporte</h2>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4 mb-3">
              <div className="flex items-center mb-3">
                <div className="bg-green-500 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Precisa de ajuda?</h3>
                  <p className="text-sm text-green-700">Fale conosco via WhatsApp</p>
                </div>
              </div>
              
              <button
                onClick={openWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.786"/>
                </svg>
                Conversar no WhatsApp
              </button>
              
              <div className="mt-3 text-xs text-green-600 text-center">
                📞 Horário de atendimento: Seg-Sex 8h às 18h
              </div>
            </div>

            {/* Dicas rápidas */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Dúvidas frequentes:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Alterar telefone ou endereço</li>
                <li>• Problemas com pontos</li>
                <li>• Dúvidas sobre ofertas</li>
                <li>• Eco Pontos próximos</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-[#003F25] font-semibold mb-3">Sobre</h2>
            <p className="text-sm text-gray-600">
              O EcoGanha é uma iniciativa para tornar Caruaru mais sustentável durante o São João, oferecendo pontos por reciclagem que podem ser trocados por descontos e prêmios.
            </p>
          </div>
          
          <div className="border-t pt-4">
            <button 
              onClick={onLogout}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200 mt-2 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;