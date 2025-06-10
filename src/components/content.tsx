import Image from "next/image";

export function Content() {
  return (
    <div className="flex mt-8 px-4 text-[#000] font-poppins justify-between items-center">
      {/* Texto à esquerda */}
      <div className="w-[60%]">
        <h1 className="font-semibold text-lg sm:text-xl mb-2 pb-2">
          Recicle e Economize
        </h1>
        <p className="text-[#003f25] font-light text-sm sm:text-base leading-relaxed">
          Ganhe brindes<br /><br />
          Para tornar Caruaru mais sustentável e reduzir o impacto ambiental do São João, estamos introduzindo o <strong>EcoGanha</strong>.<br /><br />
          Este projeto oferece à população a oportunidade de ganhar brindes dos patrocinadores ao reciclar materiais como plásticos e alumínio.
        </p>
      </div>

      {/* Imagem à direita, colada na borda */}
      <div className="w-[40%] flex justify-end pr-0">
        <Image
          src="/imageRounded.svg"
          alt="Imagem"
          width={1000}
          height={1000}
          className="w-[20vh] sm:w-[25vh] md:w-[30vh] lg:w-[35vh]"
        />
      </div>
    </div>
  );
}
