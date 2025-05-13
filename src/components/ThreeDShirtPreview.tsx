
import React, { useEffect, useRef } from 'react';
import { CustomizationFormValues } from '@/types/customization';

interface ThreeDShirtPreviewProps {
  formData: CustomizationFormValues;
  previewImage: string | null;
  className?: string;
}

// This is a simple mock 3D preview that simulates what would be implemented with Three.js
const ThreeDShirtPreview: React.FC<ThreeDShirtPreviewProps> = ({ 
  formData, 
  previewImage, 
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a rotating 3D-like t-shirt (simplified for this demo)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw t-shirt shape
    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY - 70);
    ctx.lineTo(centerX - 70, centerY - 40);
    ctx.lineTo(centerX - 60, centerY + 70);
    ctx.lineTo(centerX + 60, centerY + 70);
    ctx.lineTo(centerX + 70, centerY - 40);
    ctx.lineTo(centerX + 50, centerY - 70);
    ctx.lineTo(centerX + 30, centerY - 90);
    ctx.lineTo(centerX - 30, centerY - 90);
    ctx.closePath();
    
    // T-shirt gradient fill
    const gradient = ctx.createLinearGradient(
      centerX - 70, centerY, centerX + 70, centerY
    );
    gradient.addColorStop(0, '#e6e6e6');
    gradient.addColorStop(0.5, '#ffffff');
    gradient.addColorStop(1, '#e6e6e6');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw collar
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 75, 20, 10, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#999';
    ctx.stroke();
    
    // Draw shoulders
    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY - 70);
    ctx.lineTo(centerX - 80, centerY - 60);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 50, centerY - 70);
    ctx.lineTo(centerX + 80, centerY - 60);
    ctx.stroke();
    
    // Draw image on shirt if provided
    if (previewImage) {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio
        const maxWidth = 80;
        const maxHeight = 80;
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        const width = img.width * ratio;
        const height = img.height * ratio;
        
        // Draw the image centered on the shirt
        ctx.drawImage(
          img, 
          centerX - width / 2, 
          centerY - height / 2 + 10, 
          width, 
          height
        );
      };
      img.src = previewImage;
    }
    
    // Draw text on shirt
    if (formData.text) {
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      
      const lines = formData.text.split('\n').slice(0, 3);
      lines.forEach((line, index) => {
        ctx.fillText(
          line, 
          centerX, 
          centerY + 40 + (index * 16)
        );
      });
    }
    
    // Add size label
    const size = getSizeRecommendation(formData.height, formData.weight, formData.build);
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText(`Size: ${size}`, centerX, centerY + 95);
    
  }, [formData, previewImage]);

  return (
    <div className={className}>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="w-full h-full border rounded-lg bg-white shadow-md animate-rotate-shirt"
      ></canvas>
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>3D Preview Mode (Press Alt+Q to switch back)</p>
        <p className="mt-2">This is a simplified 3D preview. In a production app, this would use Three.js for a fully interactive 3D model.</p>
      </div>
    </div>
  );
};

// Size recommendation function (same as in ShirtPreview)
function getSizeRecommendation(height: number, weight: number, build: string): string {
  let size = 'M';
  
  if (height < 165) {
    size = 'S';
  } else if (height > 185) {
    size = 'L';
  }
  
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

export default ThreeDShirtPreview;
