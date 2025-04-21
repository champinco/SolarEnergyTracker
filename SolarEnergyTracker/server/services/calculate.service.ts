import { type Appliance, type County, type EnergyCalculation, type SystemSizing, type ROICalculation } from '@shared/schema';
import { pvgisService } from './pvgis.service';

/**
 * Service for performing solar system calculations
 */
export class CalculateService {
  /**
   * Calculate daily energy usage based on appliances
   */
  calculateDailyUsage(appliances: Array<Appliance & { quantity: number, hoursPerDay: number }>): number {
    return appliances.reduce((total, appliance) => {
      const applianceWattHours = appliance.power * appliance.quantity * appliance.hoursPerDay;
      return total + (applianceWattHours / 1000); // Convert Wh to kWh
    }, 0);
  }
  
  /**
   * Estimate daily energy usage from monthly bill amount
   * @param billAmount - Monthly bill amount in KSh
   * @returns Daily energy usage in kWh
   */
  estimateUsageFromBill(billAmount: number): number {
    // Average Kenya Power tariff (approximate)
    const averageTariff = 25; // KSh per kWh including taxes and fees
    
    // Estimate monthly usage
    const estimatedMonthlyUsage = billAmount / averageTariff;
    
    // Convert to daily usage
    return estimatedMonthlyUsage / 30;
  }
  
  /**
   * Calculate recommended solar system size
   * @param dailyUsage - Daily energy consumption in kWh
   * @param county - County for solar irradiance data
   * @returns Recommended system size in kWp
   */
  async calculateSystemSize(params: SystemSizing): Promise<{
    systemSize: number;
    panelCount: number;
    inverterSize: number;
    batterySize: number;
    dailyProduction: number;
  }> {
    const { dailyUsage, countyId, includeStorage } = params;
    
    // Get solar data for the location
    const county = { id: countyId, name: "County", irradiance: 5.5, peakSunHours: 5.2 }; // Default values
    
    const solarData = await pvgisService.getSolarData(county);
    
    // System losses (inverter efficiency, wire losses, etc.)
    const systemLosses = 0.2; // 20% losses
    
    // Calculate system size with a safety margin
    const systemSize = (dailyUsage / (solarData.peakSunHours * (1 - systemLosses))) * 1.1; // 10% safety margin
    
    // Round to 1 decimal place
    const roundedSystemSize = Math.round(systemSize * 10) / 10;
    
    // Calculate number of panels (assuming 400W panels)
    const panelWattage = 400; // 400W per panel
    const panelCount = Math.ceil((roundedSystemSize * 1000) / panelWattage);
    
    // Calculate inverter size (typically 10-20% larger than system size)
    const inverterSize = Math.ceil(roundedSystemSize * 1.2);
    
    // Calculate battery size if storage is included
    const batterySize = includeStorage ? Math.ceil(dailyUsage * 1.5) : 0; // 1.5 days of autonomy
    
    // Calculate daily production
    const dailyProduction = roundedSystemSize * solarData.peakSunHours * (1 - systemLosses);
    
    return {
      systemSize: roundedSystemSize,
      panelCount,
      inverterSize,
      batterySize,
      dailyProduction
    };
  }
  
  /**
   * Calculate system cost based on system size
   * @param systemSize - System size in kWp
   * @param includeStorage - Whether to include battery storage
   * @returns Estimated cost range in KSh
   */
  calculateSystemCost(systemSize: number, includeStorage: boolean = false): {
    minCost: number;
    maxCost: number;
    averageCost: number;
  } {
    // Base cost per kWp (without batteries)
    const baseCostPerKwp = 120000; // KSh per kWp
    
    // Cost range variation
    const minVariation = 0.9; // 10% below average
    const maxVariation = 1.2; // 20% above average
    
    // Battery cost if included
    const batteryCost = includeStorage ? systemSize * 80000 : 0; // KSh per kWp for battery storage
    
    // Calculate total average cost
    const totalAverageCost = (systemSize * baseCostPerKwp) + batteryCost;
    
    // Calculate min and max costs
    const minCost = Math.round(totalAverageCost * minVariation);
    const maxCost = Math.round(totalAverageCost * maxVariation);
    
    return {
      minCost,
      maxCost,
      averageCost: Math.round((minCost + maxCost) / 2)
    };
  }
  
  /**
   * Calculate ROI based on system cost, size, and daily usage
   */
  calculateROI(params: ROICalculation): {
    monthlySavings: number;
    annualSavings: number;
    paybackPeriod: number;
    twentyYearSavings: number;
    yearByYearAnalysis: Array<{
      year: number;
      gridCost: number;
      solarCost: number;
      cumulativeSavings: number;
    }>;
  } {
    const {
      systemSize,
      systemCost,
      dailyUsage,
      electricityRate,
      annualIncrease
    } = params;
    
    // Monthly grid electricity cost
    const monthlyGridCost = dailyUsage * 30 * electricityRate;
    
    // Average solar system degradation per year (typically 0.5-0.8%)
    const annualDegradation = 0.007; // 0.7% per year
    
    // Calculate 20-year analysis
    const yearByYearAnalysis = [];
    let cumulativeSavings = 0;
    let currentYearSavings = 0;
    let paybackYear = 0;
    let paybackPeriod = 0;
    
    for (let year = 1; year <= 25; year++) {
      // Calculate grid cost with annual increases
      const gridCost = monthlyGridCost * 12 * Math.pow(1 + (annualIncrease / 100), year - 1);
      
      // Calculate solar production accounting for degradation
      const solarProduction = dailyUsage * 365 * Math.pow(1 - annualDegradation, year - 1);
      
      // Solar costs (maintenance, etc. - typically very low)
      const annualSolarMaintenance = systemSize * 2000; // KSh per kWp per year
      
      // First year includes system cost
      const solarCost = year === 1 ? systemCost + annualSolarMaintenance : annualSolarMaintenance;
      
      // Annual savings
      currentYearSavings = gridCost - solarCost;
      cumulativeSavings += currentYearSavings;
      
      // Determine payback period (when cumulative savings become positive)
      if (cumulativeSavings >= 0 && paybackYear === 0) {
        paybackYear = year;
        if (year > 1) {
          // Calculate partial year for more precise payback period
          const previousYearSavings = yearByYearAnalysis[year - 2].cumulativeSavings;
          const savingsNeeded = -previousYearSavings;
          const fractionOfYear = savingsNeeded / currentYearSavings;
          paybackPeriod = year - 1 + fractionOfYear;
        } else {
          paybackPeriod = 1;
        }
      }
      
      yearByYearAnalysis.push({
        year,
        gridCost,
        solarCost,
        cumulativeSavings
      });
    }
    
    // If payback period wasn't reached in 25 years
    if (paybackYear === 0) {
      paybackPeriod = 25;
    }
    
    return {
      monthlySavings: monthlyGridCost - (systemCost / (paybackPeriod * 12)),
      annualSavings: monthlyGridCost * 12 - (systemCost / paybackPeriod),
      paybackPeriod,
      twentyYearSavings: yearByYearAnalysis[19]?.cumulativeSavings || 0,
      yearByYearAnalysis
    };
  }
}

export const calculateService = new CalculateService();
