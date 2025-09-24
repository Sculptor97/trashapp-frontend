// Mapbox API utilities for address autocomplete and geocoding
import { APP_CONFIG } from '@/config/app';

const MAPBOX_BASE_URL = 'https://api.mapbox.com';

// Types for Mapbox API responses
export interface MapboxFeature {
  id: string;
  type: 'Feature';
  place_type: string[];
  relevance: number;
  properties: {
    accuracy?: string;
    address?: string;
    category?: string;
    maki?: string;
  };
  text: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

export interface MapboxGeocodingResponse {
  type: 'FeatureCollection';
  query: string[];
  features: MapboxFeature[];
  attribution: string;
}

export interface AddressSuggestion {
  id: string;
  text: string;
  placeName: string;
  coordinates: [number, number]; // [longitude, latitude]
  relevance: number;
  context: {
    region?: string;
    district?: string;
    locality?: string;
    neighborhood?: string;
    address?: string;
  };
}

export interface GeocodeResult {
  address: string;
  coordinates: [number, number];
  confidence: 'high' | 'medium' | 'low';
  components: {
    street?: string;
    neighborhood?: string;
    locality?: string;
    district?: string;
    region?: string;
    country?: string;
  };
}

// Mapbox API service class
export class MapboxService {
  private accessToken: string;

  constructor(accessToken: string = APP_CONFIG.mapbox.accessToken) {
    this.accessToken = accessToken;
  }

  /**
   * Search for address suggestions using Mapbox Geocoding API
   */
  async searchAddresses(
    query: string,
    options?: {
      country?: string;
      types?: string[];
      proximity?: [number, number];
      bbox?: [number, number, number, number];
      limit?: number;
    }
  ): Promise<AddressSuggestion[]> {
    if (!query.trim()) return [];

    try {
      const params = new URLSearchParams({
        access_token: this.accessToken,
        limit: (options?.limit || 5).toString(),
        country: options?.country || 'CM', // Cameroon
        language: 'en,fr', // English and French for Cameroon
      });

      if (options?.types?.length) {
        params.append('types', options.types.join(','));
      }

      if (options?.proximity) {
        params.append('proximity', options.proximity.join(','));
      }

      if (options?.bbox) {
        params.append('bbox', options.bbox.join(','));
      }

      const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data: MapboxGeocodingResponse = await response.json();

      return data.features.map(feature => ({
        id: feature.id,
        text: feature.text,
        placeName: feature.place_name,
        coordinates: feature.center,
        relevance: feature.relevance,
        context: this.parseContext(feature.context || []),
      }));
    } catch (error) {
      console.error('Address search failed:', error);
      throw new Error('Failed to search addresses');
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(
    coordinates: [number, number]
  ): Promise<GeocodeResult | null> {
    try {
      const [lng, lat] = coordinates;
      const params = new URLSearchParams({
        access_token: this.accessToken,
        country: 'CM',
        language: 'en,fr',
      });

      const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${lng},${lat}.json?${params}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
      }

      const data: MapboxGeocodingResponse = await response.json();

      if (data.features.length === 0) {
        return null;
      }

      const feature = data.features[0];
      const context = this.parseContext(feature.context || []);

      return {
        address: feature.place_name,
        coordinates: feature.center,
        confidence: this.getConfidence(feature.relevance),
        components: {
          street: feature.text,
          neighborhood: context.neighborhood,
          locality: context.locality,
          district: context.district,
          region: context.region,
          country: 'Cameroon',
        },
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  /**
   * Validate if an address exists and get its coordinates
   */
  async validateAddress(address: string): Promise<{
    isValid: boolean;
    coordinates?: [number, number];
    suggestion?: string;
    confidence?: 'high' | 'medium' | 'low';
  }> {
    try {
      const suggestions = await this.searchAddresses(address, { limit: 1 });

      if (suggestions.length === 0) {
        return { isValid: false };
      }

      const suggestion = suggestions[0];

      return {
        isValid: true,
        coordinates: suggestion.coordinates,
        suggestion: suggestion.placeName,
        confidence: this.getConfidence(suggestion.relevance),
      };
    } catch (error) {
      console.error('Address validation failed:', error);
      return { isValid: false };
    }
  }

  /**
   * Get current user location (requires permission)
   */
  async getCurrentLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        error => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  calculateDistance(
    coord1: [number, number],
    coord2: [number, number]
  ): number {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;

    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private parseContext(
    context: Array<{ id: string; text: string; short_code?: string }>
  ) {
    const parsed: {
      region?: string;
      district?: string;
      locality?: string;
      neighborhood?: string;
      address?: string;
    } = {};

    context.forEach(item => {
      if (item.id.startsWith('region')) {
        parsed.region = item.text;
      } else if (item.id.startsWith('district')) {
        parsed.district = item.text;
      } else if (item.id.startsWith('place')) {
        parsed.locality = item.text;
      } else if (item.id.startsWith('neighborhood')) {
        parsed.neighborhood = item.text;
      } else if (item.id.startsWith('address')) {
        parsed.address = item.text;
      }
    });

    return parsed;
  }

  private getConfidence(relevance: number): 'high' | 'medium' | 'low' {
    if (relevance >= 0.8) return 'high';
    if (relevance >= 0.5) return 'medium';
    return 'low';
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const mapboxService = new MapboxService();

// Utility functions for common use cases
export const mapboxUtils = {
  /**
   * Format coordinates for display
   */
  formatCoordinates(
    coordinates: [number, number],
    precision: number = 6
  ): string {
    const [lng, lat] = coordinates;
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
  },

  /**
   * Check if coordinates are within Cameroon bounds (approximate)
   */
  isWithinCameroon(coordinates: [number, number]): boolean {
    const [lng, lat] = coordinates;
    // Approximate bounds of Cameroon
    const bounds = {
      north: 13.1,
      south: 1.7,
      east: 16.2,
      west: 8.5,
    };

    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  },

  /**
   * Get major cities in Cameroon for proximity search
   */
  getCameroonCities(): Array<{ name: string; coordinates: [number, number] }> {
    return [
      { name: 'Douala', coordinates: [9.7043, 4.0483] },
      { name: 'Yaoundé', coordinates: [11.5174, 3.848] },
      { name: 'Garoua', coordinates: [13.3978, 9.3265] },
      { name: 'Maroua', coordinates: [14.3159, 10.5913] },
      { name: 'Bamenda', coordinates: [10.1591, 5.9631] },
      { name: 'Bafoussam', coordinates: [10.4203, 5.4781] },
      { name: 'Ngaoundéré', coordinates: [13.5847, 7.3167] },
      { name: 'Bertoua', coordinates: [13.6848, 4.5767] },
      { name: 'Ebolowa', coordinates: [11.1546, 2.9069] },
      { name: 'Limbe', coordinates: [9.2145, 4.0186] },
    ];
  },
};

export default mapboxService;
