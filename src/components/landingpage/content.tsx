import Image from "next/image";

export function Content() {
  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Título centralizado */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#003F25] mb-12">
          Por que Usar o EcoGanha?
        </h2>

        {/* Layout para mobile */}
        <div className="lg:hidden text-center">
          <div className="max-w-sm mx-auto">
          
          {/* Imagem */}
          <div className="flex justify-center mb-6">
            <Image
              src="/imageRounded.svg"
              alt="Por que usar EcoGanha"
              width={1000}
              height={1000}
              className="w-[35vh] sm:w-[35vh] max-w-[280px]"
            />
          </div>
          
          {/* Conteúdo com marcadores */}
          <div className="text-left max-w-xs mx-auto space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#FBCA27] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-bold text-[#003f25] text-lg">Ajude o Meio Ambiente:</span>
                <span className="text-[#003f25] text-lg sm:text-base"> Contribua para a redução do lixo e a preservação dos recursos naturais.</span>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-[#FBCA27] rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <span className="font-bold text-[#003f25] text-lg">Ganhe Recompensas:</span>
                <span className="text-[#003f25] text-lg sm:text-base"> Transforme sua atitude sustentável em vantagens reais.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout para tablet/desktop */}
      <div className="hidden lg:flex w-full max-w-7xl mx-auto px-8 items-center">
        {/* Coluna da imagem (esquerda) */}
        <div className="flex-1 flex items-center relative">
         <Image
            src="/imageRounded.svg"
            alt="Por que usar EcoGanha"
            width={1000}
            height={1000}
            className="w-[60vh] xl:w-[55vh] z-10"
          />
        </div>

        {/* Coluna do texto (direita) */}
        <div className="flex-1 pl-12">
          <div className="max-w-xl">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-[#FBCA27] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-bold text-[#003f25] text-3xl xl:text-3xl">Ajude o Meio Ambiente:</span>
                  <span className="text-[#003f25] text-3xl xl:text-3xl"> Contribua para a redução do lixo e a preservação dos recursos naturais.</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-[#FBCA27] rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-bold text-[#003f25] text-3xl xl:text-3xl">Ganhe Recompensas:</span>
                  <span className="text-[#003f25] text-3xl xl:text-3xl"> Transforme sua atitude sustentável em vantagens reais.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}