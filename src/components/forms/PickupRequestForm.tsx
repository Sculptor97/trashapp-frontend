import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressInput } from './AddressInput';
import { APP_CONFIG } from '@/config/app';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Package,
  Camera,
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Trash2,
  Recycle,
  Zap,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';
import type { WasteType } from '@/types/pickup';

// Form validation schema
const pickupRequestSchema = z.object({
  address: z.string().min(10, 'Address must be at least 10 characters'),
  coordinates: z.tuple([z.number(), z.number()]).optional(),
  wasteType: z.enum(['general', 'recyclable', 'hazardous'] as const),
  pickupDate: z.string().min(1, 'Please select a pickup date'),
  pickupTime: z.enum(['morning', 'afternoon', 'evening'] as const),
  estimatedWeight: z
    .number()
    .min(1, 'Please estimate the weight')
    .max(1000, 'Maximum 1000kg per pickup'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  urgentPickup: z.boolean().default(false),
  recurringPickup: z.boolean().default(false),
  recurringFrequency: z
    .enum(['weekly', 'biweekly', 'monthly'] as const)
    .optional(),
});

type PickupRequestFormData = z.infer<typeof pickupRequestSchema>;

interface PickupRequestFormProps {
  onSubmit: (data: PickupRequestFormData & { photos?: File[] }) => void;
  isLoading?: boolean;
  className?: string;
}

const wasteTypes: Array<{
  type: WasteType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  examples: string[];
}> = [
  {
    type: 'general',
    label: 'General Waste',
    description: 'Regular household and office waste',
    icon: <Trash2 className="h-6 w-6 text-gray-600" />,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    examples: ['Food scraps', 'Paper towels', 'Non-recyclable items'],
  },
  {
    type: 'recyclable',
    label: 'Recyclable Materials',
    description: 'Items that can be recycled',
    icon: <Recycle className="h-6 w-6 text-green-600" />,
    color: 'bg-green-100 text-green-800 border-green-200',
    examples: ['Plastic bottles', 'Cardboard', 'Glass', 'Metal cans'],
  },
  {
    type: 'hazardous',
    label: 'Hazardous Waste',
    description: 'Items requiring special handling',
    icon: <Zap className="h-6 w-6 text-red-600" />,
    color: 'bg-red-100 text-red-800 border-red-200',
    examples: ['Batteries', 'Electronics', 'Chemicals', 'Medical waste'],
  },
];

const timeSlots = [
  {
    value: 'morning',
    label: 'Morning (8AM - 12PM)',
    icon: <Sunrise className="h-4 w-4" />,
  },
  {
    value: 'afternoon',
    label: 'Afternoon (12PM - 5PM)',
    icon: <Sun className="h-4 w-4" />,
  },
  {
    value: 'evening',
    label: 'Evening (5PM - 8PM)',
    icon: <Sunset className="h-4 w-4" />,
  },
];

const recurringOptions = [
  { value: 'weekly', label: 'Weekly', description: 'Every week' },
  { value: 'biweekly', label: 'Bi-weekly', description: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly', description: 'Every month' },
];

export function PickupRequestForm({
  onSubmit,
  isLoading = false,
  className,
}: PickupRequestFormProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [addressValid, setAddressValid] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number>(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<PickupRequestFormData>({
    resolver: zodResolver(pickupRequestSchema),
    defaultValues: {
      urgentPickup: false,
      recurringPickup: false,
    },
  });

  const watchedValues = watch();
  const { wasteType, estimatedWeight, urgentPickup, recurringPickup } =
    watchedValues;

  // Calculate estimated cost based on waste type, weight, and urgency
  const calculateCost = (type: WasteType, weight: number, urgent: boolean) => {
    const baseCosts = {
      general: 1000, // FCFA per kg
      recyclable: 800,
      hazardous: 2000,
    };

    let cost = baseCosts[type] * weight;
    if (urgent) cost *= 1.5; // 50% surcharge for urgent pickup

    return Math.round(cost);
  };

  // Update estimated cost when relevant fields change
  React.useEffect(() => {
    if (wasteType && estimatedWeight) {
      const cost = calculateCost(wasteType, estimatedWeight, urgentPickup);
      setEstimatedCost(cost);
    }
  }, [wasteType, estimatedWeight, urgentPickup]);

  // Handle address changes
  const handleAddressChange = (
    address: string,
    coordinates?: [number, number]
  ) => {
    setValue('address', address);
    setValue('coordinates', coordinates);
  };

  const handleAddressValidation = (isValid: boolean) => {
    setAddressValid(isValid);
  };

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    setPhotos(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 photos
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleFormSubmit = (data: PickupRequestFormData) => {
    onSubmit({ ...data, photos });
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-brand-primary" />
          Request Pickup
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Main Form Grid - Two Column Layout */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Pickup Location
                </h3>

                <AddressInput
                  value={watchedValues.address}
                  onChange={handleAddressChange}
                  onValidationChange={handleAddressValidation}
                  label="Pickup Address"
                  placeholder="Enter the pickup address..."
                  required
                  className="w-full"
                />

                {errors.address && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Schedule Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Pickup
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      min={getMinDate()}
                      max={getMaxDate()}
                      {...register('pickupDate')}
                    />
                    {errors.pickupDate && (
                      <p className="text-sm text-red-600">
                        {errors.pickupDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Time</Label>
                    <div className="space-y-2">
                      {timeSlots.map(slot => (
                        <label
                          key={slot.value}
                          className={cn(
                            'flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-colors',
                            watchedValues.pickupTime === slot.value
                              ? 'border-brand-primary bg-brand-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <input
                            type="radio"
                            value={slot.value}
                            {...register('pickupTime')}
                            className="sr-only"
                          />
                          {slot.icon}
                          <span className="text-sm font-medium">
                            {slot.label}
                          </span>
                          {watchedValues.pickupTime === slot.value && (
                            <CheckCircle className="h-4 w-4 text-brand-primary ml-auto" />
                          )}
                        </label>
                      ))}
                    </div>
                    {errors.pickupTime && (
                      <p className="text-sm text-red-600">
                        {errors.pickupTime.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Weight and Cost */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Weight & Cost</h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedWeight">
                      Estimated Weight (kg)
                    </Label>
                    <Input
                      id="estimatedWeight"
                      type="number"
                      min="1"
                      max="1000"
                      step="0.5"
                      placeholder="e.g., 15"
                      {...register('estimatedWeight', { valueAsNumber: true })}
                    />
                    {errors.estimatedWeight && (
                      <p className="text-sm text-red-600">
                        {errors.estimatedWeight.message}
                      </p>
                    )}
                  </div>

                  {estimatedCost > 0 && (
                    <div className="p-4 bg-brand-light/20 rounded-lg">
                      <div className="text-xl font-bold text-brand-primary mb-1">
                        {APP_CONFIG.currency.format(estimatedCost)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Base rate:{' '}
                        {APP_CONFIG.currency.format(
                          estimatedCost / (urgentPickup ? 1.5 : 1)
                        )}
                        {urgentPickup && (
                          <span className="text-orange-600">
                            {' '}
                            + 50% urgent surcharge
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Waste Type Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Waste Type</h3>

                <div className="space-y-3">
                  {wasteTypes.map(type => (
                    <label
                      key={type.type}
                      className={cn(
                        'relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md block',
                        wasteType === type.type
                          ? 'border-brand-primary bg-brand-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <input
                        type="radio"
                        value={type.type}
                        {...register('wasteType')}
                        className="sr-only"
                      />

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{type.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {type.description}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {type.examples.map((example, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {wasteType === type.type && (
                          <CheckCircle className="h-5 w-5 text-brand-primary flex-shrink-0" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                {errors.wasteType && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.wasteType.message}
                  </p>
                )}
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Options</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-md border">
                    <Checkbox
                      id="urgent-pickup"
                      {...register('urgentPickup')}
                    />
                    <Label
                      htmlFor="urgent-pickup"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Urgent Pickup
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Priority scheduling (+50% surcharge)
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-md border">
                    <Checkbox
                      id="recurring-pickup"
                      {...register('recurringPickup')}
                    />
                    <Label
                      htmlFor="recurring-pickup"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="font-medium">Recurring Pickup</div>
                      <div className="text-sm text-muted-foreground">
                        Set up regular pickup schedule
                      </div>
                    </Label>
                  </div>
                </div>

                {recurringPickup && (
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <div className="grid gap-2">
                      {recurringOptions.map(option => (
                        <label
                          key={option.value}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-colors',
                            watchedValues.recurringFrequency === option.value
                              ? 'border-brand-primary bg-brand-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          )}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register('recurringFrequency')}
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <span className="font-medium">{option.label}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              {option.description}
                            </span>
                          </div>
                          {watchedValues.recurringFrequency ===
                            option.value && (
                            <CheckCircle className="h-4 w-4 text-brand-primary" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Photos Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photos (Optional)
                </h3>

                <div className="space-y-3">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-brand-primary hover:bg-brand-primary/5 transition-colors">
                      <Camera className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <div className="text-sm font-medium">Upload Photos</div>
                      <div className="text-xs text-muted-foreground">
                        Max 5 photos, 5MB each
                      </div>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="sr-only"
                    />
                  </Label>

                  {photos.length > 0 && (
                    <div className="grid gap-2 grid-cols-3">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-16 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions for the pickup team..."
              rows={3}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="text-sm text-red-600">{errors.notes.message}</p>
            )}
          </div>

          {/* Submit Button - Full Width */}
          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-secondary py-3"
            disabled={isLoading || !isValid || !addressValid}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isLoading ? 'Requesting Pickup...' : 'Request Pickup'}
            {estimatedCost > 0 && (
              <span className="ml-2">
                • {APP_CONFIG.currency.format(estimatedCost)}
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
