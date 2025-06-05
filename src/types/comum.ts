// src/types/comum.ts - VERSÃO COMPLETA ATUALIZADA

// Tipos de dados para o dashboard do Usuário Comum

export type UserTabType = 
  | 'home' 
  | 'rewards' 
  | 'map' 
  | 'profile' 
  | 'activities' 
  | 'redemptions' 
  | 'editProfile'; // <- ADICIONADO

export interface EcoPoint {
  id: string;
  name: string;
  address: string;
  openingHours: string;
  materials: Material[];
}

export interface Material {
  id: string;
  name: string;
  pointsPerKg: number;
}

export interface Partner {
  id: string;
  name: string;
  logo?: string;
  location?: string;
  offers: Offer[];
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  points: number;
  quantity: number; // <- OPCIONAL: quantidade disponível
  image?: string; // <- OPCIONAL: imagem da oferta
  validUntil?: string;
}

export interface RecycleTransaction {
  id: string;
  weight: number;
  points: number;
  date: string;
  materialName: string;
  ecoPointName: string;
}

export interface RedemptionTransaction {
  id: string;
  points: number;
  date: string;
  title: string;
  description?: string;
  partnerName: string;
}

export interface SelectedPartner extends Partner {
  location: string;
}

// <- NOVA: Interface para dados de perfil completo
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
  age?: number;
  address?: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

// <- NOVA: Interface para atualização de perfil
export interface ProfileUpdateData {
  name?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}