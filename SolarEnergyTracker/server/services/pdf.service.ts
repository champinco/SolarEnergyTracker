import { type County, type Project } from '@shared/schema';

/**
 * Service for generating PDF reports
 * 
 * Note: Since we're implementing this on the frontend with React-to-PDF,
 * this service is a placeholder that could be expanded in the future 
 * to generate reports on the server side
 */
export class PDFService {
  /**
   * Generate report data for a project
   * This prepares the data structure that will be used by the frontend PDF generator
   */
  generateReportData(project: Project, county: County): {
    projectDetails: any;
    systemDetails: any;
    financialAnalysis: any;
    environmentalImpact: any;
  } {
    // Calculate system details
    const panelCount = Math.ceil((project.systemSize * 1000) / 400); // Assuming 400W panels
    const roofAreaNeeded = project.systemSize * 6; // Approximately 6 sq meters per kWp
    
    // Calculate annual generation
    const annualGeneration = project.systemSize * county.peakSunHours * 365 * 0.8; // 20% system losses
    
    // Environmental calculations
    const carbonOffset = annualGeneration * 0.5; // 0.5 kg CO2 per kWh for Kenya's grid
    const treesEquivalent = carbonOffset / 25; // 25 kg CO2 per tree per year
    
    return {
      projectDetails: {
        location: county.name,
        date: project.createdAt,
        dailyUsage: project.dailyUsage,
        monthlyUsage: project.monthlyUsage
      },
      systemDetails: {
        systemSize: project.systemSize,
        panelCount,
        panelType: "Monocrystalline 400W",
        inverterSize: Math.ceil(project.systemSize * 1.1),
        roofAreaNeeded,
        annualGeneration
      },
      financialAnalysis: {
        systemCost: project.estimatedCost,
        monthlySavings: project.monthlySavings,
        paybackPeriod: project.paybackPeriod,
        roi: (project.monthlySavings * 12 * 25) / project.estimatedCost * 100
      },
      environmentalImpact: {
        carbonOffset,
        treesEquivalent
      }
    };
  }
}

export const pdfService = new PDFService();
