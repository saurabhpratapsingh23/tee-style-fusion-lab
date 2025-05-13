
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Controller, Control } from 'react-hook-form';
import { CustomizationFormValues } from '@/types/customization';

interface SizeSelectorProps {
  control: Control<CustomizationFormValues>;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ control }) => {
  return (
    <div className="space-y-6 bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="height">Height (cm)</Label>
        <Controller
          name="height"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <Slider
                id="height"
                min={150}
                max={210}
                step={1}
                value={[field.value]}
                onValueChange={(values) => field.onChange(values[0])}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10 text-right">{field.value}</span>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">Weight (kg)</Label>
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-4">
              <Slider
                id="weight"
                min={40}
                max={140}
                step={1}
                value={[field.value]}
                onValueChange={(values) => field.onChange(values[0])}
                className="flex-1"
              />
              <span className="text-sm font-medium w-10 text-right">{field.value}</span>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="build">Build</Label>
        <Controller
          name="build"
          control={control}
          render={({ field }) => (
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select build type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lean">Lean</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="athletic">Athletic</SelectItem>
                <SelectItem value="big">Big</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );
};

export default SizeSelector;
