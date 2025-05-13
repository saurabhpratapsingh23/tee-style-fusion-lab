
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Receipt } from 'lucide-react';

import ImageUploader from '@/components/ImageUploader';
import SizeSelector from '@/components/SizeSelector';
import TextCustomizer from '@/components/TextCustomizer';
import ShirtPreview from '@/components/ShirtPreview';
import ThreeDShirtPreview from '@/components/ThreeDShirtPreview';
import ThemeSelector from '@/components/ThemeSelector';
import ShirtColorPicker from '@/components/ShirtColorPicker';
import { calculatePrice } from '@/utils/pricingUtils';

import { CustomizationFormValues } from '@/types/customization';

const DEFAULT_FORM_VALUES: CustomizationFormValues = {
  height: 180,
  weight: 80,
  build: 'athletic',
  text: '',
  textColor: '#000000',
  shirtColor: '#ffffff'
};

const Index = () => {
  // State for theme and image
  const [theme, setTheme] = useState<string>('theme-1');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [show3DView, setShow3DView] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('size');
  const [price, setPrice] = useState<number>(19.99);

  // Form setup
  const { control, watch, handleSubmit, reset } = useForm<CustomizationFormValues>({
    defaultValues: DEFAULT_FORM_VALUES
  });

  // Watch form values for live preview
  const formValues = watch();

  // Calculate price whenever form values change
  useEffect(() => {
    const newPrice = calculatePrice(formValues, previewImage !== null);
    setPrice(newPrice);
  }, [formValues, previewImage]);

  // Handle image upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewImage(e.target.result as string);
        toast.success('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission (just for demo purposes)
  const onSubmit = (data: CustomizationFormValues) => {
    toast.success('T-shirt customization saved!');
    console.log('Form submitted:', data);
  };

  // Handle reset
  const handleReset = () => {
    reset(DEFAULT_FORM_VALUES);
    setPreviewImage(null);
    toast.info('Customization reset');
  };

  // Handle keyboard shortcut for 3D view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'q') {
        setShow3DView((prev) => !prev);
        toast.info(show3DView ? 'Switched to form view' : 'Switched to 3D view');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [show3DView]);

  return (
    <div className={`min-h-screen ${theme} bg-[var(--color-background)]`}>
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-[var(--color-primary)] font-mono">CUSTOM-T</h1>
          <p className="text-[var(--color-text)] mt-2 text-lg">Design your vibe ✨</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          {!show3DView ? (
            <div className="w-full lg:w-2/3 flex flex-col md:flex-row gap-6">
              {/* Control Panel */}
              <Card className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden border-[var(--color-primary)] border">
                <CardContent className="p-0">
                  <Tabs defaultValue="size" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-4 bg-[var(--color-primary)] text-white">
                      <TabsTrigger value="size" className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary)]">
                        Size
                      </TabsTrigger>
                      <TabsTrigger value="color" className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary)]">
                        Color
                      </TabsTrigger>
                      <TabsTrigger value="design" className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary)]">
                        Design
                      </TabsTrigger>
                      <TabsTrigger value="text" className="data-[state=active]:bg-white data-[state=active]:text-[var(--color-primary)]">
                        Text
                      </TabsTrigger>
                    </TabsList>

                    {/* Size Tab */}
                    <TabsContent value="size" className="p-4">
                      <SizeSelector control={control} />
                    </TabsContent>
                    
                    {/* Color Tab */}
                    <TabsContent value="color" className="p-4">
                      <ShirtColorPicker control={control} />
                    </TabsContent>

                    {/* Design Tab */}
                    <TabsContent value="design" className="p-4">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Upload Design</h3>
                        <ImageUploader
                          onImageUpload={handleImageUpload}
                          previewImage={previewImage}
                          className="h-40"
                        />
                        <ThemeSelector
                          currentTheme={theme}
                          onThemeChange={setTheme}
                        />
                      </div>
                    </TabsContent>

                    {/* Text Tab */}
                    <TabsContent value="text" className="p-4">
                      <TextCustomizer control={control} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Preview Section */}
              <Card className="w-full md:w-1/2 bg-white rounded-xl shadow-lg overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 text-[var(--color-primary)] flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Preview
                  </h2>
                  <ShirtPreview
                    formData={formValues}
                    previewImage={previewImage}
                    className="mb-4"
                  />
                  
                  <div className="flex justify-center gap-2 mt-4">
                    <div className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-accent)] p-[2px] rounded-lg">
                      <Button
                        onClick={() => setShow3DView(true)}
                        className="bg-white hover:bg-gray-100 text-[var(--color-primary)] w-full"
                      >
                        View in 3D
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="w-full lg:w-2/3 bg-white rounded-xl shadow-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-[var(--color-primary)]">3D Preview</h2>
                  <Button
                    onClick={() => setShow3DView(false)}
                    className="bg-[var(--color-secondary)] hover:bg-[var(--color-accent)] text-white"
                  >
                    Back to Editor
                  </Button>
                </div>
                <ThreeDShirtPreview
                  formData={formValues}
                  previewImage={previewImage}
                />
              </CardContent>
            </Card>
          )}

          {/* Order Summary Section */}
          <Card className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg overflow-hidden h-fit">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary)] flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Your Custom T-Shirt
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Size</span>
                  <span className="font-bold">
                    {getSizeRecommendation(formValues.height, formValues.weight, formValues.build)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Height</span>
                  <span>{formValues.height} cm</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Weight</span>
                  <span>{formValues.weight} kg</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Build</span>
                  <span className="capitalize">{formValues.build}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Shirt Color</span>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: formValues.shirtColor || '#ffffff' }}
                    ></div>
                    <span>{formValues.shirtColor === '#ffffff' ? 'White' : 
                           formValues.shirtColor === '#000000' ? 'Black' : 'Custom'}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Custom Design</span>
                  <span>{previewImage ? 'Yes (+$5.99)' : 'No'}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Custom Text</span>
                  <span>
                    {formValues.text ? `Yes (${formValues.text.split('\n').filter(line => line.trim() !== '').length} lines)` : 'No'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Text Color</span>
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-2" 
                      style={{ backgroundColor: formValues.textColor || '#000000' }}
                    ></div>
                    <span>{formValues.textColor === '#000000' ? 'Black' : 
                           formValues.textColor === '#ffffff' ? 'White' : 'Custom'}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-bold text-[var(--color-primary)]">${price}</span>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={handleReset}
                    variant="outline" 
                    className="w-1/3 border-[var(--color-primary)] text-[var(--color-primary)]"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleSubmit(onSubmit)} 
                    className="w-2/3 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 text-white"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>Press Alt+Q to toggle between normal and 3D view</p>
          <p className="mt-2">© {new Date().getFullYear()} CUSTOM-T. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

// Helper function for size recommendation
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

export default Index;
