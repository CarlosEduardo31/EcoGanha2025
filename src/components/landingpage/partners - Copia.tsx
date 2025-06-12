"use client"
import { useState, useEffect } from "react";
import Image from "next/image";

export function Partners() {
  // Array com 15 parceiros (você deve substituir pelos logos reais)
  const partners = [
    { id: 1, name: "Parceiro 1", logo: "/parceiros/coca.jpg", website: "https://parceiro1.com" },
    { id: 2, name: "Parceiro 2", logo: "/logo-parceiro-2.svg", website: "https://parceiro2.com" },
    { id: 3, name: "Parceiro 3", logo: "/logo-parceiro-3.svg", website: "https://parceiro3.com" },
    { id: 4, name: "Parceiro 4", logo: "/logo-parceiro-4.svg", website: "https://parceiro4.com" },
    { id: 5, name: "Parceiro 5", logo: "/logo-parceiro-5.svg", website: "https://parceiro5.com" },
    { id: 6, name: "Parceiro 6", logo: "/logo-parceiro-6.svg", website: "https://parceiro6.com" },
    { id: 7, name: "Parceiro 7", logo: "/logo-parceiro-7.svg", website: "https://parceiro7.com" },
    { id: 8, name: "Parceiro 8", logo: "/logo-parceiro-8.svg", website: "https://parceiro8.com" },
    { id: 9, name: "Parceiro 9", logo: "/logo-parceiro-9.svg", website: "https://parceiro9.com" },
    { id: 10, name: "Parceiro 10", logo: "/logo-parceiro-10.svg", website: "https://parceiro10.com" },
    { id: 11, name: "Parceiro 11", logo: "/logo-parceiro-11.svg", website: "https://parceiro11.com" },
    { id: 12, name: "Parceiro 12", logo: "/logo-parceiro-12.svg", website: "https://parceiro12.com" },
    { id: 13, name: "Parceiro 13", logo: "/logo-parceiro-13.svg", website: "https://parceiro13.com" },
    { id: 14, name: "Parceiro 14", logo: "/logo-parceiro-14.svg", website: "https://parceiro14.com" },
    { id: 15, name: "Parceiro 15", logo: "/logo-parceiro-15.svg", website: "https://parceiro15.com" },
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

        {/* Grid para Desktop */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <a
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group block w-full h-20 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-70 group-hover:opacity-100"
              />
            </a>
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
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-16 sm:h-20 flex items-center justify-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={100}
                      height={50}
                      className="max-w-full max-h-full object-contain filter grayscale opacity-70"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-6 space-x-2">
            {partners.slice(0, 5).map((_, index) => (
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

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Junte-se aos nossos parceiros e faça parte da revolução sustentável
          </p>
          <button className="bg-[#003F25] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#005c38] transition-colors duration-300">
            Seja um Parceiro
          </button>
        </div>
      </div>
    </div>
  );
}