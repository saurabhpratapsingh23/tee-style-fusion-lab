
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Controller, Control } from 'react-hook-form';
import { CustomizationFormValues } from '@/types/customization';
import ColorPicker from './ColorPicker';

interface TextCustomizerProps {
  control: Control<CustomizationFormValues>;
}

const TEXT_COLORS = [
  { value: '#000000', label: 'Black', bgClass: 'bg-black' },
  { value: '#ffffff', label: 'White', bgClass: 'bg-white' },
  { value: '#ff0000', label: 'Red', bgClass: 'bg-red-500' },
  { value: '#0000ff', label: 'Blue', bgClass: 'bg-blue-500' },
  { value: '#ffff00', label: 'Yellow', bgClass: 'bg-yellow-400' },
  { value: '#00ff00', label: 'Green', bgClass: 'bg-green-500' },
  { value: '#ff00ff', label: 'Pink', bgClass: 'bg-pink-500' },
  { value: '#ff8c00', label: 'Orange', bgClass: 'bg-orange-500' },
];

const TextCustomizer: React.FC<TextCustomizerProps> = ({ control }) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="text">Text for T-shirt (up to 3 lines)</Label>
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <Textarea
              id="text"
              placeholder="Add your custom text here..."
              className="resize-none"
              rows={3}
              {...field}
            />
          )}
        />
        <p className="text-xs text-gray-500">Enter up to 3 lines of text to be printed on the shirt.</p>
      </div>
      
      <Controller
        name="textColor"
        control={control}
        render={({ field }) => (
          <ColorPicker
            label="Text Color"
            selectedColor={field.value}
            onColorChange={field.onChange}
            colors={TEXT_COLORS}
          />
        )}
      />
    </div>
  );
};

export default TextCustomizer;
