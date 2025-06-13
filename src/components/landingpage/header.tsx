"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="w-full h-16 sm:h-20">
      <div className="bg-[#FBCA27] w-full h-16 sm:h-20 grid grid-cols-3 items-center shadow-lg fixed z-20 px-4 sm:px-6">
        {/* Seção Esquerda - Botão Menu */}
        <div className="flex justify-start">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus:outline-none"
          >
            <Image
              alt="Menu"
              height={100}
              width={100}
              src={"/menu-svgrepo-com (2).svg"}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
          </button>
        </div>
        
        {/* Seção Centro - Logo */}
        <div className="flex justify-center">
          <Image
            alt="Logo"
            height={1000}
            width={1000}
            src={"/logoSVG.svg"}
            className="w-16 h-16 sm:w-20 sm:h-20"
          />
        </div>
        
        {/* Seção Direita - Botão Entrar/Sair */}
        <div className="flex justify-end">
          {user ? (
            <button 
              onClick={logout}
              className="bg-[#003F25] text-white px-3 py-1 rounded-md text-sm"
            >
              Sair
            </button>
          ) : (
            <Link href="../login">
              <span className="bg-[#003F25] text-white px-3 py-1 rounded-md text-sm">
                Entrar
              </span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Menu lateral */}
      {menuOpen && (
        <div className="fixed top-16 sm:top-20 left-0 h-screen w-64 bg-white shadow-lg z-20 transform transition-transform duration-300 ease-in-out">
          <div className="p-4">
            <ul className="space-y-4">
              <li className="p-2 hover:bg-gray-100 rounded-md">
                <Link href="/" className="block text-[#003F25] font-medium">
                  Início
                </Link>
              </li>
              {!user && (
                <li className="p-2 hover:bg-gray-100 rounded-md">
                  <Link href="/login" className="block text-[#003F25] font-medium">
                    Login
                  </Link>
                </li>
              )}
              {user && (
                <>
                  <li className="p-2 hover:bg-gray-100 rounded-md">
                    <Link href="/dashboard" className="block text-[#003F25] font-medium">
                      Dashboard
                    </Link>
                  </li>
                  <li className="p-2 hover:bg-gray-100 rounded-md">
                    <button 
                      onClick={logout} 
                      className="block text-[#003F25] font-medium"
                    >
                      Sair
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
      
      {/* Overlay para fechar o menu ao clicar fora */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-12"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}