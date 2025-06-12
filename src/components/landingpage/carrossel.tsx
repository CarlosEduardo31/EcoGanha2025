"use client"
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function Carrossel() {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const carouselItems = [
    {
      id: 1,
      // Imagens específicas para cada breakpoint
      imageMobile: "/carousel/mobile/1.svg",    // Exemplo: 343x192px (aprox.)
      imageTablet: "",    // Exemplo: 736x256px (aprox.)
      imageDesktop: "",  // Exemplo: 1408x320px (aprox.)
      title: "Redução de Resíduos",
      description: "Ajude a reduzir o impacto ambiental do São João de Caruaru"
    },
    {
      id: 2,
      imageMobile: "/carousel/mobile/2.svg",
      imageTablet: "",
      imageDesktop: "",
      title: "Ganhe Descontos",
      description: "Troque pontos por descontos exclusivos em produtos e serviços"
    },
    {
      id: 3,
      imageMobile: "/carousel/mobile/3.svg",
      imageTablet: "",
      imageDesktop: "",
      title: "Proteja o Meio Ambiente",
      description: "Contribua para um futuro mais sustentável para nossa cidade"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentImageSrc, setCurrentImageSrc] = useState("");

  // Função para avançar o carrossel
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, [carouselItems.length]);

  // Função para voltar o carrossel
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  }, [carouselItems.length]);

  // Auto-play do carrossel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [nextSlide]);

  // Lógica para determinar a imagem a ser exibida com base no tamanho da tela
  useEffect(() => {
    const updateImageSrc = () => {
      const currentItem = carouselItems[currentIndex];
      const screenWidth = window.innerWidth;

      if (screenWidth >= 1024) { // Desktop (lg breakpoint)
        setCurrentImageSrc(currentItem.imageDesktop);
      } else if (screenWidth >= 768) { // Tablet (md breakpoint)
        setCurrentImageSrc(currentItem.imageTablet);
      } else if (screenWidth >= 640) { // Pequeno Tablet (sm breakpoint)
        setCurrentImageSrc(currentItem.imageTablet); // Pode usar a mesma imagem de tablet ou criar uma específica
      } else { // Mobile (default)
        setCurrentImageSrc(currentItem.imageMobile);
      }
    };

    updateImageSrc(); // Define a imagem inicial
    window.addEventListener("resize", updateImageSrc); // Atualiza ao redimensionar

    return () => window.removeEventListener("resize", updateImageSrc);
  }, [currentIndex, carouselItems]); // Adicionado carouselItems como dependência

  // Manipuladores de eventos de toque para suporte a gestos móveis
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Deslizar para a esquerda (próximo)
      nextSlide();
    }

    if (touchStart - touchEnd < -50) {
      // Deslizar para a direita (anterior)
      prevSlide();
    }
  };

  return (
    <div className="w-full my-8 px-4 py-12 bg-gray-50">
      <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#003F25] mb-12">
        Benefícios da Iniciativa
      </h2>

      {/* Container principal do carrossel */}
      <div
        className="relative overflow-hidden rounded-lg shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides do carrossel */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-48 sm:h-64 md:h-72 lg:h-80"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {carouselItems.map((item, index) => (
            <div key={item.id} className="min-w-full relative">
              {/* Renderiza a imagem apenas se currentImageSrc for a da imagem atual */}
              {index === currentIndex && currentImageSrc && (
                <Image
                  src={currentImageSrc} // Usa a imagem dinâmica
                  alt={item.title}
                  width={1} // Next.js requer width/height, mas eles serão sobrescritos por w-full h-full e object-contain
                  height={1}
                  className="w-full h-full object-cover" // Alterado para object-contain
                  priority={item.id === 1}
                />
              )}
              {/* Adiciona um fundo para preencher os espaços vazios de object-contain */}
              <div className="absolute inset-0 bg-gray-200 -z-10" />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                {/* <h2 className="text-white font-semibold text-lg">{item.title}</h2>
                <p className="text-white text-sm">{item.description}</p> */}
              </div>
            </div>
          ))}
        </div>

        {/* Botões de navegação */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 focus:outline-none"
          aria-label="Slide anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 focus:outline-none"
          aria-label="Próximo slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicadores de posição */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}