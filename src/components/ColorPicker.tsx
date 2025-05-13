
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ColorPickerProps {
  label: string;
  selectedColor: string;
  onColorChange: (color: string) => void;
  colors: Array<{value: string, label: string, bgClass: string}>;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  selectedColor, 
  onColorChange, 
  colors 
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <RadioGroup 
        value={selectedColor} 
        onValueChange={onColorChange}
        className="flex flex-wrap gap-2"
      >
        {colors.map((color) => (
          <div key={color.value} className="flex items-center space-x-1">
            <RadioGroupItem 
              value={color.value} 
              id={`color-${color.value}`} 
              className="sr-only" 
            />
            <Label 
              htmlFor={`color-${color.value}`} 
              className={`w-6 h-6 rounded-full cursor-pointer border border-gray-300 hover:scale-110 transition-transform ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-[var(--color-primary)]' : ''
              } ${color.bgClass}`}
            />
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ColorPicker;
