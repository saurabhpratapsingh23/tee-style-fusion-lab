
import React from 'react';
import ColorPicker from './ColorPicker';
import { Control, Controller } from 'react-hook-form';
import { CustomizationFormValues } from '@/types/customization';

interface ShirtColorPickerProps {
  control: Control<CustomizationFormValues>;
}

const SHIRT_COLORS = [
  { value: '#ffffff', label: 'White', bgClass: 'bg-white' },
  { value: '#000000', label: 'Black', bgClass: 'bg-black' },
  { value: '#0000ff', label: 'Blue', bgClass: 'bg-blue-500' },
  { value: '#ff0000', label: 'Red', bgClass: 'bg-red-500' },
  { value: '#808080', label: 'Gray', bgClass: 'bg-gray-500' },
  { value: '#00ff00', label: 'Green', bgClass: 'bg-green-500' },
  { value: '#800080', label: 'Purple', bgClass: 'bg-purple-500' },
  { value: '#ffff00', label: 'Yellow', bgClass: 'bg-yellow-400' },
];

const ShirtColorPicker: React.FC<ShirtColorPickerProps> = ({ control }) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <Controller
        name="shirtColor"
        control={control}
        render={({ field }) => (
          <ColorPicker
            label="T-Shirt Color"
            selectedColor={field.value}
            onColorChange={field.onChange}
            colors={SHIRT_COLORS}
          />
        )}
      />
    </div>
  );
};

export default ShirtColorPicker;
