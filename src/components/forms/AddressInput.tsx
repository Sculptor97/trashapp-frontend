import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { mapboxService, type AddressSuggestion } from '@/lib/utils/mapbox';
import { cn } from '@/lib/utils';
import {
  MapPin,
  Loader2,
  CheckCircle,
  AlertCircle,
  Navigation,
  X,
} from 'lucide-react';

interface AddressInputProps {
  value?: string;
  onChange: (address: string, coordinates?: [number, number]) => void;
  onValidationChange?: (
    isValid: boolean,
    confidence?: 'high' | 'medium' | 'low'
  ) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showCurrentLocation?: boolean;
  validateOnBlur?: boolean;
}

export function AddressInput({
  value = '',
  onChange,
  onValidationChange,
  label = 'Address',
  placeholder = 'Enter your address...',
  required = false,
  disabled = false,
  className,
  showCurrentLocation = true,
  validateOnBlur = true,
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationState, setValidationState] = useState<{
    isValid: boolean;
    confidence?: 'high' | 'medium' | 'low';
    message?: string;
  }>({ isValid: false });
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | undefined
  >();

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input changes with debounced search
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setSelectedCoordinates(undefined);
    setValidationState({ isValid: false });

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search for very short queries
    if (newValue.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      onChange(newValue);
      return;
    }

    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      await searchAddresses(newValue);
    }, 300);

    onChange(newValue);
  };

  // Search for address suggestions
  const searchAddresses = async (query: string) => {
    if (!query.trim() || query.length < 3) return;

    setIsLoading(true);
    try {
      const results = await mapboxService.searchAddresses(query, {
        limit: 5,
        types: ['address', 'poi', 'place'],
      });

      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error('Address search failed:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.placeName);
    setSelectedCoordinates(suggestion.coordinates);
    setShowSuggestions(false);
    setSuggestions([]);

    // Set validation state based on relevance
    const confidence =
      suggestion.relevance >= 0.8
        ? 'high'
        : suggestion.relevance >= 0.5
          ? 'medium'
          : 'low';

    setValidationState({
      isValid: true,
      confidence,
      message: `Address verified with ${confidence} confidence`,
    });

    onChange(suggestion.placeName, suggestion.coordinates);
    onValidationChange?.(true, confidence);
  };

  // Validate address on blur
  const handleBlur = async () => {
    if (!validateOnBlur || !inputValue.trim() || selectedCoordinates) return;

    setIsValidating(true);
    try {
      const validation = await mapboxService.validateAddress(inputValue);

      setValidationState({
        isValid: validation.isValid,
        confidence: validation.confidence,
        message: validation.isValid
          ? `Address verified with ${validation.confidence} confidence`
          : 'Address could not be verified',
      });

      if (validation.isValid && validation.coordinates) {
        setSelectedCoordinates(validation.coordinates);
        onChange(validation.suggestion || inputValue, validation.coordinates);
      }

      onValidationChange?.(validation.isValid, validation.confidence);
    } catch (error) {
      console.error('Address validation failed:', error);
      setValidationState({
        isValid: false,
        message: 'Failed to validate address',
      });
      onValidationChange?.(false);
    } finally {
      setIsValidating(false);
    }

    setShowSuggestions(false);
  };

  // Get current location
  const handleCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const coordinates = await mapboxService.getCurrentLocation();
      const result = await mapboxService.reverseGeocode(coordinates);

      if (result) {
        setInputValue(result.address);
        setSelectedCoordinates(result.coordinates);
        setValidationState({
          isValid: true,
          confidence: result.confidence,
          message: `Current location detected with ${result.confidence} confidence`,
        });

        onChange(result.address, result.coordinates);
        onValidationChange?.(true, result.confidence);
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
      setValidationState({
        isValid: false,
        message: 'Failed to get current location',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear input
  const handleClear = () => {
    setInputValue('');
    setSelectedCoordinates(undefined);
    setValidationState({ isValid: false });
    setSuggestions([]);
    setShowSuggestions(false);
    onChange('');
    onValidationChange?.(false);
    inputRef.current?.focus();
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative w-full', className)}>
      <div className="space-y-2">
        <Label htmlFor="address-input" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>

        <div className="relative">
          <Input
            ref={inputRef}
            id="address-input"
            type="text"
            value={inputValue}
            onChange={e => handleInputChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'pr-20',
              validationState.isValid && 'border-green-500',
              validationState.isValid === false &&
                inputValue.trim() &&
                'border-red-500'
            )}
          />

          {/* Loading/Validation indicators */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {(isLoading || isValidating) && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}

            {!isLoading && !isValidating && validationState.isValid && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}

            {!isLoading &&
              !isValidating &&
              validationState.isValid === false &&
              inputValue.trim() && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}

            {inputValue && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Current location button */}
        {showCurrentLocation && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCurrentLocation}
            disabled={isLoading || disabled}
            className="w-full"
          >
            <Navigation className="h-4 w-4 mr-2" />
            Use Current Location
          </Button>
        )}

        {/* Validation message */}
        {validationState.message && (
          <div
            className={cn(
              'flex items-center gap-2 text-sm',
              validationState.isValid ? 'text-green-600' : 'text-red-600'
            )}
          >
            {validationState.isValid ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {validationState.message}
            {validationState.confidence && (
              <Badge
                variant={
                  validationState.confidence === 'high'
                    ? 'default'
                    : validationState.confidence === 'medium'
                      ? 'secondary'
                      : 'outline'
                }
                className="ml-2"
              >
                {validationState.confidence} confidence
              </Badge>
            )}
          </div>
        )}

        {/* Coordinates display */}
        {selectedCoordinates && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {selectedCoordinates[1].toFixed(6)},{' '}
            {selectedCoordinates[0].toFixed(6)}
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto"
        >
          <CardContent className="p-2">
            {suggestions.map(suggestion => (
              <Button
                key={suggestion.id}
                variant="ghost"
                className="w-full justify-start p-3 h-auto text-left"
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {suggestion.text}
                    </div>
                    <div className="text-sm text-muted-foreground truncate">
                      {suggestion.placeName}
                    </div>
                    {suggestion.context.locality && (
                      <div className="text-xs text-muted-foreground">
                        {suggestion.context.locality}
                        {suggestion.context.region &&
                          `, ${suggestion.context.region}`}
                      </div>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'shrink-0',
                      suggestion.relevance >= 0.8 &&
                        'border-green-500 text-green-700',
                      suggestion.relevance >= 0.5 &&
                        suggestion.relevance < 0.8 &&
                        'border-yellow-500 text-yellow-700',
                      suggestion.relevance < 0.5 &&
                        'border-red-500 text-red-700'
                    )}
                  >
                    {Math.round(suggestion.relevance * 100)}%
                  </Badge>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
