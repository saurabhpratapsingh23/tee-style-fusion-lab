import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CustomizationFormValues } from '@/types/customization';
import * as THREE from 'three';

interface ThreeDShirtPreviewProps {
  formData: CustomizationFormValues;
  previewImage: string | null;
  className?: string;
}

const TShirtModel: React.FC<{
  formData: CustomizationFormValues;
  previewImage: string | null;
}> = ({ formData, previewImage }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const shirtColor = formData.shirtColor || '#ffffff';

  // Create a canvas for the shirt texture
  const createShirtCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill with shirt color
    ctx.fillStyle = shirtColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw image if available (centered, upper half)
    if (previewImage) {
      const img = new window.Image();
      img.src = previewImage;
      // Draw image after it loads
      img.onload = () => {
        // Draw image in the center upper half
        const imgWidth = canvas.width * 0.5;
        const imgHeight = canvas.height * 0.5;
        ctx.drawImage(
          img,
          (canvas.width - imgWidth) / 2,
          canvas.height * 0.18,
          imgWidth,
          imgHeight
        );
        if (textLines.length > 0) drawText();
        if (shirtTexture) shirtTexture.needsUpdate = true;
      };
    }

    // Draw text (centered, below image)
    const textLines = formData.text ? formData.text.split('\n').slice(0, 3) : [];
    function drawText() {
      ctx.font = 'bold 72px Arial';
      ctx.fillStyle = formData.textColor || '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lineHeight = 80;
      const startY = canvas.height * 0.7 - ((textLines.length - 1) * lineHeight) / 2;
      textLines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
      });
    }
    if (!previewImage && textLines.length > 0) drawText();

    return canvas;
  };

  // Create and update the shirt texture
  const [shirtTexture, setShirtTexture] = React.useState<THREE.Texture | null>(null);
  useEffect(() => {
    const canvas = createShirtCanvas();
    if (canvas) {
      const texture = new THREE.CanvasTexture(canvas);
      setShirtTexture(texture);
    }
    // eslint-disable-next-line
  }, [formData.shirtColor, formData.text, formData.textColor, previewImage]);

  return (
    <group>
      {/* T-shirt body with projected design */}
      <mesh ref={mesh} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.5, 3, 64, 1, true]} />
        <meshStandardMaterial 
          color={shirtColor}
          map={shirtTexture || undefined}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Sleeves */}
      <mesh position={[-1.1, 0.7, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[1.1, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 32, Math.PI]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
    </group>
  );
};

const ThreeDShirtPreview: React.FC<ThreeDShirtPreviewProps> = ({ 
  formData, 
  previewImage, 
  className 
}) => {
  return (
    <div className={`w-full h-[500px] ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <TShirtModel formData={formData} previewImage={previewImage} />
        <OrbitControls enableZoom={true} enablePan={true} />
      </Canvas>
      <div className="mt-4 text-center text-sm">
        <p className="font-medium">Interact with the 3D model:</p>
        <ul className="text-gray-500 mt-1">
          <li>• Click and drag to rotate</li>
          <li>• Scroll to zoom</li>
          <li>• Press Alt+Q to switch back</li>
        </ul>
        <p className="mt-2 text-xs text-gray-400">Size: {getSizeRecommendation(formData.height, formData.weight, formData.build)}</p>
      </div>
    </div>
  );
};

// Size recommendation helpers (unchanged)
function getSizeRecommendation(height: number, weight: number, build: string): string {
  let size = 'M';
  if (height < 165) size = 'S';
  else if (height > 185) size = 'L';
  if (build === 'lean') {
    if (weight < 65) size = downSize(size);
  } else if (build === 'big') {
    size = upSize(size);
    if (weight > 100) size = upSize(size);
  }
  return size;
}
function upSize(currentSize: string): string {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(currentSize);
  if (index < sizes.length - 1) return sizes[index + 1];
  return currentSize;
}
function downSize(currentSize: string): string {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const index = sizes.indexOf(currentSize);
  if (index > 0) return sizes[index - 1];
  return currentSize;
}

export default ThreeDShirtPreview;
