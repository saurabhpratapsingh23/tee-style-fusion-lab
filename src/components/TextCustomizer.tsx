
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Controller, Control } from 'react-hook-form';
import { CustomizationFormValues } from '@/types/customization';

interface TextCustomizerProps {
  control: Control<CustomizationFormValues>;
}

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
    </div>
  );
};

export default TextCustomizer;
