import axios from 'axios';
import { type County } from '@shared/schema';

// Interface for PVGIS API response
interface PVGISResponse {
  inputs: {
    location: {
      latitude: number;
      longitude: number;
      elevation: number;
    };
  };
  outputs: {
    monthly: {
      fixed: {
        month: number;
        H_m: number; // Monthly irradiation
        E_m: number; // Monthly AC energy output
      }[];
    };
  };
}

// Map of Kenya counties to approximate coordinates
const countyCoordinates: Record<string, [number, number]> = {
  "Nairobi": [-1.286389, 36.817223],
  "Mombasa": [-4.05466, 39.66359],
  "Kisumu": [-0.10221, 34.76171],
  "Nakuru": [-0.30719, 36.07574],
  "Kiambu": [-1.17139, 36.82417],
  "Machakos": [-1.52233, 37.26531],
  "Kajiado": [-1.8559, 36.7870],
  "Garissa": [-0.45275, 39.64601],
  "Turkana": [3.11988, 35.59642]
};

/**
 * Service for interacting with the PVGIS API to get solar irradiance data
 */
export class PVGISService {
  private baseUrl = 'https://re.jrc.ec.europa.eu/api/v5_2/';
  
  /**
   * Get solar irradiance data for a county
   * Falls back to stored county data if API fails
   */
  async getSolarData(county: County): Promise<{ 
    irradiance: number; 
    peakSunHours: number;
    monthlyData?: Array<{ month: number; irradiation: number }>;
  }> {
    try {
      // Get coordinates for the county
      const coordinates = countyCoordinates[county.name];
      
      if (!coordinates) {
        // If coordinates not found, return stored values
        return {
          irradiance: county.irradiance,
          peakSunHours: county.peakSunHours
        };
      }
      
      const [lat, lon] = coordinates;
      
      // Call PVGIS API
      const response = await axios.get<PVGISResponse>(`${this.baseUrl}seriescalc`, {
        params: {
          lat,
          lon,
          outputformat: 'json',
          startyear: 2020,
          endyear: 2020,
          pvcalculation: 1,
          peakpower: 1,
          loss: 14
        },
        timeout: 10000 // 10 second timeout
      });
      
      // Process API response
      if (response.data && response.data.outputs && response.data.outputs.monthly) {
        const monthlyData = response.data.outputs.monthly.fixed.map(item => ({
          month: item.month,
          irradiation: item.H_m / 30 // Convert monthly to daily average
        }));
        
        // Calculate average annual irradiance
        const annualIrradiance = monthlyData.reduce((sum, item) => sum + item.irradiation, 0) / 12;
        
        // Peak sun hours is approximately equal to the irradiance
        const peakSunHours = annualIrradiance;
        
        return {
          irradiance: annualIrradiance,
          peakSunHours,
          monthlyData
        };
      }
      
      // Fallback to stored values if API response is malformed
      return {
        irradiance: county.irradiance,
        peakSunHours: county.peakSunHours
      };
      
    } catch (error) {
      console.error('Error fetching PVGIS data:', error);
      // Return stored values on error
      return {
        irradiance: county.irradiance,
        peakSunHours: county.peakSunHours
      };
    }
  }
}

export const pvgisService = new PVGISService();
