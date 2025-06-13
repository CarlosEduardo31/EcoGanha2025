// src/components/usuario/SponsorsSection.tsx

import React, { useState, useEffect } from 'react'; // Importar hooks
import Image from 'next/image';

export function SponsorsSection() {
  // Array com 8 parceiros, vindo do seu componente original
  const partners = [
    { id: 1, name: "Coca-Cola", logo: "/parceiros/coca-cola.png" },
    { id: 2, name: "Aposta Ganha", logo: "/parceiros/aposta-ganha.png" },
    { id: 3, name: "Petrobras", logo: "/parceiros/petrobras.png" },
    { id: 4, name: "Ademicon", logo: "/parceiros/ademicon.png" },
    { id: 5, name: "Loteria Caixa", logo: "/parceiros/loteria-caixa.png" },
    { id: 6, name: "O Boticário", logo: "/parceiros/boticario.png" },
    { id: 7, name: "Electrolux", logo: "/parceiros/electrolux.png" },
    { id: 8, name: "Banco do Nordeste", logo: "/parceiros/banco-do-nordeste.png" },
  ];

  // Hooks para controlar o estado do carrossel
  const [currentIndex, setCurrentIndex] = useState(0);

  // Efeito para o auto-scroll do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      // Avança o índice do carrossel, voltando ao início no final
      setCurrentIndex((prevIndex) => 
        prevIndex === partners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Muda a cada 3 segundos

    // Limpa o intervalo quando o componente é desmontado para evitar vazamento de memória
    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-[#003F25] font-semibold text-lg mb-4">
        Nossos Parceiros
      </h2>

      {/* Grid para DESKTOP (telas grandes, 'lg' e acima) */}
      {/* A classe 'hidden lg:grid' faz este bloco aparecer apenas em telas grandes */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-gray-50 rounded-lg flex items-center justify-center p-2 h-20 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <Image
              src={partner.logo} //
              alt={partner.name} //
              width={120}
              height={60}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Carrossel para MOBILE/TABLET (telas menores que 'lg') */}
      {/* A classe 'lg:hidden' faz este bloco aparecer apenas em telas pequenas/médias */}
      <div className="lg:hidden">
        <div className="relative overflow-hidden">
          {/* O container flexível que se move */}
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }} // Mostra 3 itens por vez
          >
            {/* Mapeamos os parceiros para criar os slides do carrossel */}
            {partners.map((partner) => (
              <div key={partner.id} className="min-w-[33.333%] px-2">
                <div className="w-full h-20 flex items-center justify-center p-2 bg-gray-50 rounded-lg shadow-sm">
                  <Image
                    src={partner.logo} //
                    alt={partner.name} //
                    width={100}
                    height={50}
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores do carrossel (pontos) */}
        <div className="flex justify-center mt-4 space-x-2">
          {/* Como temos 8 itens e mostramos 3, teremos 3 "páginas" (3, 3, 2) */}
          {Array.from({ length: Math.ceil(partners.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`h-2 w-2 rounded-full transition-colors ${
                Math.floor(currentIndex / 3) === index ? "bg-[#003F25]" : "bg-gray-300"
              }`}
              aria-label={`Ir para grupo ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}