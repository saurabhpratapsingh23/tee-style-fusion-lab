
import { CustomizationFormValues } from '@/types/customization';

export function calculatePrice(formData: CustomizationFormValues, hasDesign: boolean): number {
  // Base price for a t-shirt
  let price = 19.99;
  
  // Add price based on size (larger sizes cost more)
  const size = getSizeRecommendation(formData.height, formData.weight, formData.build);
  if (['L', 'XL', 'XXL'].includes(size)) {
    price += size === 'L' ? 2 : size === 'XL' ? 4 : 6;
  }
  
  // Add price for custom design
  if (hasDesign) {
    price += 5.99;
  }
  
  // Add price for custom text
  if (formData.text && formData.text.trim() !== '') {
    // Count lines of text
    const textLines = formData.text.split('\n').filter(line => line.trim() !== '');
    price += textLines.length * 1.5;
  }
  
  // Special color options (not white or black) cost extra
  if (formData.shirtColor !== '#ffffff' && formData.shirtColor !== '#000000') {
    price += 2.50;
  }
  
  return parseFloat(price.toFixed(2));
}

// Size recommendation function (duplicate of the one in ShirtPreview for modularity)
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
