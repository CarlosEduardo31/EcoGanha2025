// Tipos para o dashboard do Patrocinador
export type SponsorTabType = 'search' | 'history' | 'offers' | 'profile';

// Interface para os dados do usuário
export interface UserData {
  id: string;
  name: string;
  phone: string;
  userType: string;
  points: number;
}

// Interface para as ofertas do patrocinador - ATUALIZADA com quantity e image
export interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
  quantity: number;        // <- CAMPO ADICIONADO
  image?: string | null;   // <- NOVO CAMPO PARA IMAGEM BASE64
  validUntil?: string;     // <- Campo opcional para data de validade
  createdAt?: string;      // <- Campo opcional para data de criação
  updatedAt?: string;      // <- Campo opcional para data de atualização
}

// Interface para os resgates realizados
export interface Redemption {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  offerId: string;
  offerTitle: string;
  points: number;
  date: string;
}

// Interfaces auxiliares para formulários

// Interface para dados de criação de oferta
export interface CreateOfferData {
  title: string;
  description: string;
  points: number;
  quantity: number;        // <- NOVO CAMPO
  validUntil?: string;
}

// Interface para dados de atualização de oferta
export interface UpdateOfferData {
  title?: string;
  description?: string;
  points?: number;
  quantity?: number;       // <- NOVO CAMPO
  validUntil?: string;
}

// Interface para dados de resgate
export interface RedemptionRequestData {
  userId: string;
  offerId: string;
}