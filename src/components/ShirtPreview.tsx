import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { CustomizationFormValues } from '@/types/customization';

interface ShirtPreviewProps {
  formData: CustomizationFormValues;
  previewImage: string | null;
  className?: string;
}

const ShirtPreview: React.FC<ShirtPreviewProps> = ({ 
  formData, 
  previewImage, 
  className 
}) => {
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Split the text into lines (max 3)
  const textLines = formData.text
    .split('\n')
    .slice(0, 3)
    .filter(line => line.trim() !== '');

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - textPosition.x,
      y: e.clientY - textPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTextPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className={cn('relative flex items-center justify-center', className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative">
        {/* T-shirt base image */}
        <svg 
          viewBox="0 0 300 350" 
          className="w-full max-w-md"
        >
          <path 
            d="M60,40 L120,10 L180,10 L240,40 L270,90 L250,95 L260,180 L260,330 L40,330 L40,180 L50,95 L30,90 Z" 
            fill={formData.shirtColor || "#ffffff"} 
            stroke="#000000" 
            strokeWidth="2"
          />
          <path 
            d="M120,10 L180,10 L170,50 L130,50 Z" 
            fill={formData.shirtColor || "#ffffff"} 
            stroke="#000000" 
            strokeWidth="1"
          />
          <path 
            d="M30,90 L5,60 L35,20 L60,40 L50,95" 
            fill={formData.shirtColor || "#ffffff"} 
            stroke="#000000" 
            strokeWidth="2"
          />
          <path 
            d="M270,90 L295,60 L265,20 L240,40 L250,95" 
            fill={formData.shirtColor || "#ffffff"} 
            stroke="#000000" 
            strokeWidth="2"
          />
        </svg>

        {/* Image on shirt */}
        {previewImage && (
          <div 
            className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1/2"
          >
            <img 
              src={previewImage} 
              alt="T-shirt design" 
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Text on shirt */}
        {textLines.length > 0 && (
          <div 
            className="absolute cursor-move select-none"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(${textPosition.x}px, ${textPosition.y}px)`,
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
          >
            {textLines.map((line, index) => (
              <div 
                key={index} 
                className="text-sm md:text-base font-bold my-1 text-center"
                style={{ color: formData.textColor || '#000000' }}
              >
                {line}
              </div>
            ))}
          </div>
        )}

        {/* Size indicator */}
        <div className="absolute bottom-4 right-4 text-xs bg-black text-white px-2 py-1 rounded">
          {getSizeRecommendation(formData.height, formData.weight, formData.build)}
        </div>
      </div>
    </div>
  );
};

// Function to determine recommended size based on height, weight and build
function getSizeRecommendation(height: number, weight: number, build: string): string {
  // Very basic size recommendation algorithm
  
  // Base size based on height
  let size = 'M';
  
  if (height < 165) {
    size = 'S';
  } else if (height > 185) {
    size = 'L';
  }
  
  // Adjust based on weight and build
  if (build === 'lean') {
    if (weight < 65) {
      size = downSize(size);
    }
  } else if (build === 'athletic' || build === 'regular') {
    // No adjustment for average builds
  } else if (build === 'big') {
    size = upSize(size);
    if (weight > 100) {
      size = upSize(size);
    }
  }
  
  return size;
}

// Helper functions to adjust sizes
function upSize(currentSize: string): string {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(currentSize);
  if (index < sizes.length - 1) {
    return sizes[index + 1];
  }
  return currentSize;
}

function downSize(currentSize: string): string {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(currentSize);
  if (index > 0) {
    return sizes[index - 1];
  }
  return currentSize;
}

export default ShirtPreview;
