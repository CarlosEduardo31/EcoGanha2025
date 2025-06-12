import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-[#003F25] text-white py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-xl sm:text-2xl font-semibold mb-2">EcoGanha</h1>
        <p className="text-center flex justify-center flex-col sm:flex-row text-sm sm:text-base">
          <span className="flex items-center justify-center">
            Feito com 
            <span className="text-red-500 mx-1 text-lg">♥</span>
          </span>
          <span>para um lugar mais verde</span>
        </p>
        
        {/* <div className="flex items-center justify-center gap-4 mt-4">
          <a href="#" className="transition-transform hover:scale-110">
            <Image
              src={"/instagram.svg"}
              alt="Instagram"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
          <a href="#" className="transition-transform hover:scale-110">
            <Image
              src={"/facebook.svg"}
              alt="Facebook"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </a>
        </div> */}
        
        {/* Copyright */}
        <div className="border-t border-white/20 mt-6 pt-4">
          <p className="text-center text-xs sm:text-sm text-white/80">
            © Copyright EcoGanha All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}