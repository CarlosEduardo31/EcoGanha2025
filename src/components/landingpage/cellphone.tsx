import Image from "next/image";
import Link from "next/link";

export function Cellphone() {
  return (
    <div className="min-h-[55vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center relative">
      {/* Layout para mobile - padrão UX otimizado */}
      <div className="lg:hidden w-full px-4 py-8 text-center">

        {/* Imagem do celular - menor e complementar */}
          <div className="flex justify-center mb-7">
            <Image
              src="/celular.png"
              alt="App EcoGanha"
              width={1000}
              height={1000}
              className="w-[35vh] sm:w-[40vh] max-w-[280px]"
            />
          </div>
          
        <div className="max-w-sm mx-auto">
          {/* Título principal */}
          <h1 className="text-[#003f25] text-2xl sm:text-3xl font-bold font-poppins mb-3">
            Junte-se ao EcoGanha
          </h1>
          
          {/* Subtítulo */}
          <h2 className="text-[#003f25] text-lg sm:text-xl font-semibold font-poppins mb-4">
            Recicle e Ganhe Recompensas!
          </h2>
          
          {/* Descrição concisa */}
          <p className="text-[#003f25] text-sm sm:text-base leading-relaxed mb-6 px-2">
            Transforme o descarte correto em benefícios reais. Acumule pontos e troque por produtos sustentáveis!
          </p>
          
          {/* CTA Button */}
          <Link
            href="/cadastro"
            className="inline-block bg-[#003f25] text-white font-semibold rounded-lg px-6 py-3 text-base mb-8 hover:bg-[#005c38] transition-colors duration-300 shadow-lg"
          >
            Cadastre-se Grátis
          </Link>
        </div>
        
        {/* Elemento decorativo sutil */}
        {/* <div className="absolute top-4 right-4 bg-[#FBCA27] w-16 h-16 rounded-full opacity-20 -z-10"></div>
        <div className="absolute bottom-8 left-4 bg-[#FBCA27] w-12 h-12 rounded-full opacity-15 -z-10"></div> */}
      </div>

      {/* Layout para tablet/desktop */}
      <div className="hidden lg:flex w-full max-w-7xl mx-auto px-8 items-center">
        {/* Coluna do texto */}
        <div className="flex-1 pr-12">
          <div className="max-w-xl">
            <h1 className="text-[#003f25] text-3xl xl:text-4xl font-bold font-poppins mb-2">
              Junte-se ao Ecoganha:
            </h1>
            <h2 className="text-[#003f25] text-2xl xl:text-3xl font-semibold font-poppins mb-6">
              Recicle e Ganhe Recompensas!
            </h2>
            
            <p className="text-[#003f25] text-lg xl:text-xl leading-relaxed mb-8">
              O Ecoganha transforma o descarte correto de recicláveis em benefícios reais. 
              Recicle, acumule pontos e troque por produtos sustentáveis!
            </p>
            
            <Link
              href="/cadastro"
              className="inline-block bg-[#003f25] text-white font-semibold rounded-lg px-8 py-4 text-lg hover:bg-[#005c38] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Cadastre-se
            </Link>
          </div>
        </div>

        {/* Coluna da imagem */}
        <div className="flex-1 flex justify-center items-center relative">
          {/* Fundo amarelo decorativo */}
          {/* <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-[#FBCA27] h-[25vh] w-[25vh] rounded-full opacity-80 -z-10"></div> */}
          
          <Image
            src="/celular.png"
            alt="Celular EcoGanha"
            width={1000}
            height={1000}
            className="w-[60vh] xl:w-[70vh] z-10"
          />
        </div>
      </div>
    </div>
  );
}