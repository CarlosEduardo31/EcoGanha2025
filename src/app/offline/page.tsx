// src/app/offline/page.tsx - PÁGINA OFFLINE CORRIGIDA

'use client'

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {/* Ícone offline */}
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <div className="w-10 h-10 text-gray-400">✕</div>
        </div>
        
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Você está offline</h1>
        
        {/* Descrição */}
        <p className="text-gray-600 mb-6">
          Sem conexão com a internet. Páginas visitadas anteriormente ainda funcionam.
        </p>
        
        {/* Botões */}
        <div className="space-y-3">
          <button 
            onClick={handleReload}
            className="w-full bg-[#003F25] text-white px-6 py-3 rounded-lg hover:bg-[#002918] transition-colors"
          >
            Tentar novamente
          </button>
          
          <button 
            onClick={handleGoBack}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}