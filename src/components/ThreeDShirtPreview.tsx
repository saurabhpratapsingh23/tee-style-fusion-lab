
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
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
  
  // Create a canvas for drawing text
  const createTextCanvas = () => {
    if (!formData.text) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '36px Arial';
    ctx.fillStyle = formData.textColor || '#000000';
    ctx.textAlign = 'center';
    
    const textLines = formData.text.split('\n').slice(0, 3);
    textLines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (index - 1) * 40);
    });
    
    return canvas;
  };
  
  // Create a texture for the text
  const textCanvas = createTextCanvas();
  const textTexture = textCanvas ? new THREE.CanvasTexture(textCanvas) : null;
  
  // Use uploaded image if available
  let designTexture = null;
  
  if (previewImage) {
    const img = new Image();
    img.src = previewImage;
    const texture = new THREE.Texture(img);
    img.onload = () => {
      texture.needsUpdate = true;
    };
    designTexture = texture;
  }
  
  // Animation
  useFrame(() => {
    if (!mesh.current) return;
  });
  
  return (
    <group>
      {/* T-shirt body */}
      <mesh ref={mesh} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.5, 3, 32, 1, true]} />
        <meshStandardMaterial 
          color={shirtColor}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* T-shirt front (for design) */}
      <mesh position={[0, 0, -1.15]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial 
          transparent
          color={shirtColor}
        >
          {designTexture && <primitive attach="map" object={designTexture} />}
        </meshStandardMaterial>
      </mesh>
      
      {/* T-shirt front (for text) */}
      {textTexture && (
        <mesh position={[0, -0.5, -1.16]}>
          <planeGeometry args={[2, 1]} />
          <meshStandardMaterial 
            transparent
            map={textTexture}
          />
        </mesh>
      )}
      
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
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} castShadow />
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
