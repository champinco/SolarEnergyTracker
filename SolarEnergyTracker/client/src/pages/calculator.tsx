import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Stepper, type Step } from "@/components/stepper";
import { EnergyUsage } from "@/components/energy-usage";
import { LocationSelector } from "@/components/location-selector";
import { SystemSizing } from "@/components/system-sizing";
import { ROIChart } from "@/components/roi-chart";
import { PDFReport } from "@/components/pdf-report";
import { createApiUrl } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [energyData, setEnergyData] = useState<{
    dailyUsage: number;
    monthlyUsage: number;
    appliances?: any[];
  } | null>(null);
  const [locationData, setLocationData] = useState<{
    countyId: number;
    countyName: string;
    irradiance: number;
    peakSunHours: number;
  } | null>(null);
  const [systemData, setSystemData] = useState<any>(null);
  const [roiData, setROIData] = useState<any>(null);

  // Fetch counties for the location selector
  const countiesQuery = useQuery({
    queryKey: [createApiUrl("/counties")],
  });

  // If county is selected, fetch its details
  const countyDetailsQuery = useQuery({
    queryKey: [createApiUrl(`/counties/${locationData?.countyId}`)],
    enabled: !!locationData?.countyId,
  });

  // Update location data when county details are loaded
  useEffect(() => {
    if (locationData?.countyId && countyDetailsQuery.data) {
      setLocationData({
        ...locationData,
        irradiance: countyDetailsQuery.data.irradiance,
        peakSunHours: countyDetailsQuery.data.peakSunHours,
      });
    }
  }, [countyDetailsQuery.data]);

  const steps: Step[] = [
    { id: 1, name: "Energy Usage" },
    { id: 2, name: "Location" },
    { id: 3, name: "System Sizing" },
    { id: 4, name: "Cost Analysis" },
    { id: 5, name: "Report" },
  ];

  // Handle energy usage submission
  const handleEnergySubmit = (data: any) => {
    setEnergyData(data);
    setCurrentStep(2);
  };

  // Handle location selection
  const handleLocationSubmit = (countyId: number) => {
    const selectedCounty = countiesQuery.data?.find(
      (county: any) => county.id === countyId
    );
    
    if (selectedCounty) {
      setLocationData({
        countyId,
        countyName: selectedCounty.name,
        irradiance: selectedCounty.irradiance,
        peakSunHours: selectedCounty.peakSunHours,
      });
      setCurrentStep(3);
    }
  };

  // Handle system sizing submission
  const handleSystemSubmit = (data: any) => {
    setSystemData(data);
    setCurrentStep(4);
  };

  // Handle ROI analysis submission
  const handleROISubmit = (data: any) => {
    setROIData(data);
    setCurrentStep(5);
  };

  // Handle step change
  const handleStepChange = (step: number) => {
    // Only allow going back or to completed steps
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EnergyUsage onSubmit={handleEnergySubmit} />;
      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            {countiesQuery.isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : (
              <LocationSelector
                selectedCountyId={locationData?.countyId}
                onCountySelect={handleLocationSubmit}
              />
            )}
          </div>
        );
      case 3:
        return energyData && locationData ? (
          <SystemSizing
            dailyUsage={energyData.dailyUsage}
            countyId={locationData.countyId}
            countyName={locationData.countyName}
            irradiance={locationData.irradiance}
            peakSunHours={locationData.peakSunHours}
            onBack={() => setCurrentStep(2)}
            onContinue={handleSystemSubmit}
          />
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              Please complete the previous steps first.
            </CardContent>
          </Card>
        );
      case 4:
        return systemData && energyData && locationData ? (
          <ROIChart
            systemSize={systemData.systemSize}
            systemCost={systemData.averageCost}
            dailyUsage={energyData.dailyUsage}
            countyId={locationData.countyId}
            onBack={() => setCurrentStep(3)}
            onGenerateReport={handleROISubmit}
          />
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              Please complete the previous steps first.
            </CardContent>
          </Card>
        );
      case 5:
        return energyData && locationData && systemData && roiData ? (
          <PDFReport
            energyData={energyData}
            locationData={locationData}
            systemData={systemData}
            roiData={roiData}
            onBack={() => setCurrentStep(4)}
          />
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              Please complete the previous steps first.
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mb-2">
          Solar System Calculator
        </h2>
        <p className="text-neutral-700">
          Estimate your solar needs based on energy consumption and location
        </p>
      </div>

      <Stepper
        steps={steps}
        currentStep={currentStep}
        onChange={handleStepChange}
      />

      {renderStepContent()}
    </div>
  );
}
