// src/services/api.ts

import axios from 'axios';
require('dotenv').config();

// Criando instância do axios com URL base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ecoganha2025api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor de requisições para incluir o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecoGanhaToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respostas para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber um erro 401 (não autorizado), limpar o token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ecoGanhaToken');
    }
    return Promise.reject(error);
  }
);

export default api;
