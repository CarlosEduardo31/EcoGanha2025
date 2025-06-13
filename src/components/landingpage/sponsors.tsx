"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

export function Sponsors() {
  // Array com 4 realizadores
  const sponsors = [
    { id: 1, name: "Lei Rouanet", logo: "/parceiros/lei-rouanet.png" },
    { id: 2, name: "Prefeitura de Caruaru", logo: "/parceiros/prefeitura-caruaru.png" },
    { id: 3, name: "Governo de Pernambuco", logo: "/parceiros/GovPERGB.png" },
    { id: 4, name: "Governo Federal", logo: "/parceiros/governo-federal.png" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll do carrossel (apenas para mobile)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === sponsors.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [sponsors.length]);

  return (
    <div className="w-full pb-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#003F25] mb-12">
          Realizadores
        </h2>

        {/* Grid para Desktop - 4 colunas para os 4 realizadores */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 items-center justify-items-center">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="w-full h-28 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={140}
                height={80}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Grid para Tablet - 2x2 */}
        <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-6 items-center justify-items-center">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="w-full h-24 flex items-center justify-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={120}
                height={70}
                className="max-w-full max-h-full object-contain transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Carrossel para Mobile */}
        <div className="md:hidden">
          {/* Container do carrossel */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {sponsors.map((sponsor) => (
                <div key={sponsor.id} className="min-w-full px-4">
                  <div className="w-full h-32 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={160}
                      height={90}
                      className="max-w-full max-h-full object-contain transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {sponsors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentIndex === index ? "bg-[#003F25]" : "bg-gray-300"
                }`}
                aria-label={`Ir para realizador ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}