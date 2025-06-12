"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

export function Partners() {
  // Array com 8 parceiros
  const partners = [
    { id: 1, name: "Coca-Cola", logo: "/parceiros/coca-cola.png.png" },
    { id: 2, name: "Aposta Ganha", logo: "/parceiros/aposta-ganha.png" },
    { id: 3, name: "Petrobras", logo: "/parceiros/petrobras.png" },
    { id: 4, name: "Ademicon", logo: "/parceiros/ademicon.png" },
    { id: 5, name: "Loteria Caixa", logo: "/parceiros/loteria-caixa.png" },
    { id: 6, name: "O Boticário", logo: "/parceiros/boticario.png" },
    { id: 7, name: "Electrolux", logo: "/parceiros/electrolux.png" },
    { id: 8, name: "Banco do Nordeste", logo: "/parceiros/banco-do-nordeste.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === partners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <div className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#003F25] mb-12">
          Nossos Parceiros
        </h2>

        {/* Grid para Desktop - 4x2 para 8 parceiros */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="w-full h-28 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={140}
                height={80}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Carrossel para Mobile/Tablet */}
        <div className="lg:hidden">
          {/* Container do carrossel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {/* Duplicamos os parceiros para carrossel infinito */}
              {[...partners, ...partners].map((partner, index) => (
                <div key={`${partner.id}-${index}`} className="min-w-[33.333%] px-2">
                  <div className="w-full h-20 sm:h-24 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={70}
                      className="max-w-full max-h-full object-contain transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores - para 8 parceiros, serão 3 grupos */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: 3 }).map((_, index) => (
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
    </div>
  );
}