// src/types/comum.ts

// Tipos de dados para o dashboard do Usuário Comum

export type UserTabType = 'home' | 'rewards' | 'map' | 'profile' | 'activities' | 'redemptions';

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

// Interface para ofertas - ATUALIZADA com quantity e image
export interface Offer {
  id: string;
  title: string;
  description?: string;
  points: number;
  quantity: number;        // <- CAMPO ADICIONADO
  image?: string | null;   // <- NOVO CAMPO PARA IMAGEM BASE64
  validUntil?: string;
  createdAt?: string;      // <- Campo opcional
  updatedAt?: string;      // <- Campo opcional
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