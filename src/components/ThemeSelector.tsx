
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onThemeChange 
}) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium">Choose Theme</h3>
      <RadioGroup 
        defaultValue={currentTheme} 
        onValueChange={onThemeChange}
        className="flex space-x-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="theme-1" id="theme-1" />
          <Label htmlFor="theme-1" className="cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-theme1-primary"></div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="theme-2" id="theme-2" />
          <Label htmlFor="theme-2" className="cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-theme2-primary"></div>
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="theme-3" id="theme-3" />
          <Label htmlFor="theme-3" className="cursor-pointer">
            <div className="w-6 h-6 rounded-full bg-theme3-primary"></div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ThemeSelector;
