import Link from "next/link";

export function Cadastre() {
  return (
    <div className="p-4 sm:p-6 md:p-8 text-center flex items-center justify-center flex-col ">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[#003f25] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold font-poppins mb-12">
          Cadastre-se Agora e Comece a Ganhar!
        </h1>
        
        <p className="text-[#003f25] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-12 px-2 sm:px-4 md:px-8">
          Não fique de fora dessa transformação! Inscreva-se gratuitamente e receba em primeira mão quando for lançado. Faça parte da revolução sustentável.
        </p>
        
        <Link
          href="/cadastro"
          className="inline-block bg-[#003f25] text-white font-semibold rounded-lg px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base md:text-lg hover:bg-[#005c38] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
}