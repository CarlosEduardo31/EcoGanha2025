import React, { useState } from 'react';
import ImageUpload from '../common/ImageUpload'; // <- NOVO IMPORT

interface OffersTabProps {
  offers: any[];
  onAddOffer: (offer: any) => void;
  onUpdateOffer: (offer: any) => void;
  onDeleteOffer: (offerId: string) => Promise<void>;
}

const OffersTab: React.FC<OffersTabProps> = ({ 
  offers,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer
}) => {
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPoints, setFormPoints] = useState('');
  const [formQuantity, setFormQuantity] = useState('');
  const [formImage, setFormImage] = useState<string | null>(null); // <- NOVO ESTADO
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddClick = () => {
    setIsAddingOffer(true);
    setEditingOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
    setFormQuantity('');
    setFormImage(null); // <- LIMPAR IMAGEM
    setError('');
  };

  const handleEditClick = (offer: any) => {
    setIsAddingOffer(false);
    setEditingOfferId(offer.id);
    setFormTitle(offer.title);
    setFormDescription(offer.description);
    setFormPoints(offer.points.toString());
    setFormQuantity(offer.quantity?.toString() || '1');
    setFormImage(offer.image || null); // <- CARREGAR IMAGEM
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTitle || !formDescription || !formPoints || !formQuantity) {
      setError('Todos os campos são obrigatórios');
      return;
    }
    
    const offerData = {
      id: editingOfferId || `new-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      points: parseInt(formPoints),
      quantity: parseInt(formQuantity),
      image: formImage // <- INCLUIR IMAGEM
    };
    
    if (isAddingOffer) {
      onAddOffer(offerData);
    } else if (editingOfferId) {
      onUpdateOffer(offerData);
    }
    
    // Reset form
    setIsAddingOffer(false);
    setEditingOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
    setFormQuantity('');
    setFormImage(null); // <- LIMPAR IMAGEM
    setError('');
  };

  const cancelForm = () => {
    setIsAddingOffer(false);
    setEditingOfferId(null);
    setFormTitle('');
    setFormDescription('');
    setFormPoints('');
    setFormQuantity('');
    setFormImage(null); // <- LIMPAR IMAGEM
    setError('');
  };

  const handleDelete = async (offerId: string, offerTitle: string) => {
    if (!confirm(`Tem certeza que deseja excluir a oferta "${offerTitle}"?`)) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onDeleteOffer(offerId);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao excluir oferta';
      setError(errorMessage);
      console.error('Erro ao excluir oferta:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (offer: any) => {
    if (!confirm(`Tem certeza que deseja desativar a oferta "${offer.title}"? Ela ficará indisponível para novos resgates.`)) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onUpdateOffer({
        ...offer,
        quantity: 0
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao desativar oferta';
      setError(errorMessage);
      console.error('Erro ao desativar oferta:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#003F25] font-semibold text-lg">Minhas Ofertas</h2>
        {!isAddingOffer && !editingOfferId && (
          <button 
            onClick={handleAddClick}
            className="bg-[#003F25] text-white px-3 py-1 rounded-md hover:bg-[#002918] transition duration-200 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nova Oferta
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex items-start">
            <svg className="flex-shrink-0 w-5 h-5 text-red-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-sm">{error}</p>
              {error.includes('já foi resgatada') && (
                <p className="text-xs mt-1 text-red-600">
                  💡 Dica: Use Desativar para interromper ofertas que já foram resgatadas.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {(isAddingOffer || editingOfferId) && (
        <div className="border border-gray-200 rounded-md p-4 mb-4">
          <h3 className="font-medium text-lg mb-4">
            {isAddingOffer ? 'Adicionar Nova Oferta' : 'Editar Oferta'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NOVO: Campo de upload de imagem */}
            <ImageUpload
              currentImage={formImage}
              onImageChange={setFormImage}
              maxSizeMB={0.5}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título da Oferta
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                placeholder="Ex: Copo Ecológico"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                placeholder="Ex: Copo reutilizável feito de material reciclado"
                rows={2}
                required
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pontos Necessários
                </label>
                <input
                  type="number"
                  value={formPoints}
                  onChange={(e) => setFormPoints(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  placeholder="Ex: 500"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade Disponível
                </label>
                <input
                  type="number"
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003F25]"
                  placeholder="Ex: 50"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={cancelForm}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#003F25] text-white px-4 py-2 rounded-md hover:bg-[#002918] transition duration-200"
              >
                {isAddingOffer ? 'Adicionar' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de ofertas - ATUALIZADA para mostrar imagens */}
      <div className="space-y-3">
        {offers.length === 0 ? (
          <p className="text-center py-4 text-gray-500">
            Nenhuma oferta cadastrada ainda.
          </p>
        ) : (
          offers.map((offer) => (
            <div 
              key={offer.id} 
              className="border rounded-md p-3 transition-colors border-gray-200 hover:bg-gray-50"
            >
              <div className="flex items-start space-x-3">
                {/* NOVO: Mostrar imagem da oferta */}
                {offer.image ? (
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-20 h-20 object-cover rounded-md border border-gray-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-md border border-gray-200 flex-shrink-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                <div className="flex-1">
                  <h4 className="font-medium">{offer.title}</h4>
                  <p className="text-sm text-gray-500">{offer.description}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[#003F25] font-semibold">
                      {offer.points} pontos
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      offer.quantity > 0 
                        ? offer.quantity <= 5 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {offer.quantity > 0 
                        ? `${offer.quantity} disponíveis` 
                        : 'Desativada'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {!isAddingOffer && !editingOfferId && (
                <div className="flex justify-end mt-3 space-x-2">
                  <button
                    onClick={() => handleEditClick(offer)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    disabled={loading}
                  >
                    Editar
                  </button>
                  
                  {offer.quantity > 0 ? (
                    <>
                      <button
                        onClick={() => handleDeactivate(offer)}
                        disabled={loading}
                        className="text-orange-600 hover:text-orange-800 text-sm font-medium disabled:opacity-50"
                      >
                        Desativar
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id, offer.title)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                      >
                        {loading ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleDelete(offer.id, offer.title)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                    >
                      {loading ? 'Excluindo...' : 'Excluir'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OffersTab;