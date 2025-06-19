// src/components/ecoponto/HistoryTab.tsx - TIPOS CORRIGIDOS

import React from 'react';
import { Transaction } from '@/types/ecoponto'; // ← USAR TIPO CORRETO
import { formatDate } from '@/utils/materialUtils';
import { useCountingMode } from '@/hooks/useCountingMode';

interface HistoryTabProps {
  transactions: Transaction[]; // ← TIPO CORRETO
}

// Componente para exibir quantidade adaptiva
const QuantityDisplay: React.FC<{ 
  transaction: Transaction; 
  currentMode: 'weight' | 'unit' 
}> = ({ transaction, currentMode }) => {
  // Determinar qual valor mostrar baseado na transação
  // Se a transação tem weight > 0, foi feita em modo peso
  // Se a transação tem quantity > 0, foi feita em modo unidade
  const transactionWasWeight = (transaction.weight || 0) > 0;
  const transactionWasUnit = (transaction.quantity || 0) > 0;

  if (transactionWasWeight) {
    return (
      <div>
        <span className="text-gray-500">Peso:</span> {transaction.weight || 0}kg
        {transactionWasUnit && (
          <div className="text-xs text-gray-400">
            (Qtd: {transaction.quantity || 0} unidades)
          </div>
        )}
      </div>
    );
  } else if (transactionWasUnit) {
    return (
      <div>
        <span className="text-gray-500">Quantidade:</span> {transaction.quantity || 0} {(transaction.quantity || 0) === 1 ? 'unidade' : 'unidades'}
      </div>
    );
  } else {
    // Fallback - mostrar baseado no modo atual
    return (
      <div>
        <span className="text-gray-500">
          {currentMode === 'weight' ? 'Peso:' : 'Quantidade:'}
        </span>{' '}
        {currentMode === 'weight' 
          ? `${transaction.weight || 0}kg`
          : `${transaction.quantity || 0} ${(transaction.quantity || 0) === 1 ? 'unidade' : 'unidades'}`
        }
      </div>
    );
  }
};

const HistoryTab: React.FC<HistoryTabProps> = ({ transactions }) => {
  const { mode: currentMode, loading: modeLoading } = useCountingMode();

  if (modeLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-[#003F25] font-semibold text-lg mb-4">Histórico de Transações</h2>
        <div className="flex items-center justify-center py-8">
          <svg className="animate-spin h-6 w-6 text-[#003F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-[#003F25]">Carregando histórico...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#003F25] font-semibold text-lg">Histórico de Transações</h2>
        
        {/* Indicador do modo atual */}
        <div className="flex items-center text-sm">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            currentMode === 'weight' ? 'bg-blue-500' : 'bg-green-500'
          }`}></div>
          <span className="text-gray-600">
            Modo: {currentMode === 'weight' ? 'Peso' : 'Unidade'}
          </span>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Nenhuma transação registrada ainda</p>
          <p className="text-gray-400 text-sm mt-1">
            As transações aparecerão aqui conforme forem sendo realizadas
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reciclagem Confirmada</p>
                    <p className="text-sm text-gray-500">
                      {transaction.ecoPointName || 'EcoPonto'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-green-600 font-bold text-lg">+{transaction.points}</span>
                  <p className="text-xs text-gray-500">pontos</p>
                </div>
              </div>
              
              <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Material:</span>{' '}
                  <span className="font-medium">{transaction.materialName || transaction.material}</span>
                </div>
                
                <QuantityDisplay 
                  transaction={transaction} 
                  currentMode={currentMode}
                />
                
                <div className="col-span-1 sm:col-span-2">
                  <span className="text-gray-500">Data:</span>{' '}
                  <span className="font-medium">{formatDate(transaction.date)}</span>
                </div>
              </div>

              {/* Mostrar informações técnicas se ambos os valores estiverem presentes */}
              {(transaction.weight || 0) > 0 && (transaction.quantity || 0) > 0 && (
                <div className="ml-12 mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Peso: {transaction.weight || 0}kg</span>
                    <span>Quantidade: {transaction.quantity || 0} unidades</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer com estatísticas rápidas */}
      {transactions.length > 0 && (
        <div className="mt-6 pt-4 border-t bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#003F25]">
                {transactions.length}
              </p>
              <p className="text-sm text-gray-600">Transações Hoje</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#003F25]">
                {transactions.reduce((sum, t) => sum + t.points, 0)}
              </p>
              <p className="text-sm text-gray-600">Pontos Distribuídos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTab;