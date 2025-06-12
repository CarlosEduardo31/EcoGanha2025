export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Colete e Descarte",
      description: "Separe seus materiais recicláveis e leve até um ponto de coleta credenciado.",
      icon: (
        <svg className="w-12 h-12 text-[#FBCA27]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.5h-15V5h15v14.5zm0-16.5h-15c-.83 0-1.5.67-1.5 1.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5z"/>
        </svg>
      )
    },
    {
      id: 2,
      title: "Ganhe Pontos",
      description: "Cada item reciclado gera pontos em sua conta no Ecoganha.",
      icon: (
        <svg className="w-12 h-12 text-[#FBCA27]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    },
    {
      id: 3,
      title: "Troque por Benefícios",
      description: "Utilize seus pontos para obter descontos exclusivos, brindes e outras vantagens.",
      icon: (
        <svg className="w-12 h-12 text-[#FBCA27]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h5v2h-2v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V6H2V4h5zm2-1v1h6V3H9zm-1 3v13h8V6H8z"/>
          <path d="M10 8h4v2h-4V8zm0 3h4v2h-4v-2z"/>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full py-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[#003F25] mb-12">
          Como Funciona?
        </h2>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Linha conectora (apenas em desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-[#FBCA27] opacity-30 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-[#FBCA27] border-t-2 border-t-transparent border-b-2 border-b-transparent opacity-60"></div>
                </div>
              )}

              {/* Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 text-center relative z-10 hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#FBCA27]">
                {/* Número do passo */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-[#003F25] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {step.id}
                </div>

                {/* Ícone */}
                <div className="flex justify-center mb-4 mt-2">
                  {step.icon}
                </div>

                {/* Título */}
                <h3 className="text-xl font-semibold text-[#003F25] mb-3">
                  {step.title}
                </h3>

                {/* Descrição */}
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action adicional */}
        {/* <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            É simples, rápido e você ainda ajuda o meio ambiente!
          </p>
          <button className="bg-[#003F25] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#005c38] transition-colors duration-300">
            Comece Agora
          </button>
        </div> */}
      </div>
    </div>
  );
}