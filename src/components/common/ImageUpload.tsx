// src/components/common/ImageUpload.tsx

import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (imageBase64: string | null) => void;
  className?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  className = '',
  maxSizeMB = 0.5, // 500KB por padrão
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  // Função para redimensionar imagem
  const resizeImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Converter para base64
        const base64 = canvas.toDataURL(file.type, quality);
        resolve(base64);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  // Função para processar arquivo selecionado
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsProcessing(true);

    try {
      // Validar formato
      if (!acceptedFormats.includes(file.type)) {
        throw new Error(`Formato não suportado. Use: ${acceptedFormats.join(', ')}`);
      }

      // Validar tamanho inicial
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes * 2) { // Permite 2x o limite antes de redimensionar
        throw new Error(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      }

      // Redimensionar e converter para base64
      const base64Image = await resizeImage(file);
      
      // Verificar tamanho final
      const base64Size = (base64Image.length * 3) / 4; // Tamanho aproximado em bytes
      if (base64Size > maxSizeBytes) {
        // Tentar reduzir qualidade
        const reducedQualityImage = await resizeImage(file, 600, 0.6);
        const reducedSize = (reducedQualityImage.length * 3) / 4;
        
        if (reducedSize > maxSizeBytes) {
          throw new Error('Imagem ainda muito grande após otimização. Tente uma imagem menor.');
        }
        
        onImageChange(reducedQualityImage);
      } else {
        onImageChange(base64Image);
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao processar imagem');
      console.error('Erro no upload de imagem:', error);
    } finally {
      setIsProcessing(false);
      // Limpar input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Função para remover imagem
  const handleRemoveImage = () => {
    onImageChange(null);
    setError('');
  };

  // Função para abrir seletor de arquivos
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Imagem do Produto (Opcional)
      </label>
      
      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Área de preview/upload */}
      <div className="space-y-3">
        {currentImage ? (
          // Preview da imagem atual
          <div className="relative group">
            <img
              src={currentImage}
              alt="Preview da oferta"
              className="w-full h-40 object-scale-down rounded-lg border border-gray-300"
            />
            
            {/* Overlay com ações */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={handleSelectClick}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Alterar
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={isProcessing}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          // Área para fazer upload
          <div
            onClick={handleSelectClick}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
          >
            {isProcessing ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#003F25] mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Processando imagem...</p>
              </div>
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600 mb-1">Clique para adicionar uma imagem</p>
                <p className="text-xs text-gray-500">JPEG, PNG, GIF ou WebP • Máx {maxSizeMB}MB</p>
              </div>
            )}
          </div>
        )}

        {/* Botão manual se não tiver imagem */}
        {!currentImage && !isProcessing && (
          <button
            type="button"
            onClick={handleSelectClick}
            className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-sm flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Imagem
          </button>
        )}
      </div>

      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Dicas de otimização */}
      <div className="text-xs text-gray-500">
        <p>💡 <strong>Dicas:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Imagens são redimensionadas automaticamente para otimizar o carregamento</li>
          <li>Recomendamos imagens de produtos com fundo neutro</li>
          <li>Formato ideal: JPEG ou PNG com boa qualidade</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;