import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { SummaryPanel } from "./summary-panel";

export interface SystemSizingProps {
  dailyUsage: number;
  countyId: number;
  countyName: string;
  irradiance: number;
  peakSunHours: number;
  onBack: () => void;
  onContinue: (systemDetails: any) => void;
}

export function SystemSizing({
  dailyUsage,
  countyId,
  countyName,
  irradiance,
  peakSunHours,
  onBack,
  onContinue,
}: SystemSizingProps) {
  const [systemSize, setSystemSize] = useState<number | null>(null);
  const [includeStorage, setIncludeStorage] = useState(false);
  const [adjustedSystemSize, setAdjustedSystemSize] = useState<number | null>(null);
  
  // Calculate system mutation
  const systemSizeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(
        "POST",
        "/api/calculate/system",
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      setSystemSize(data.systemSize);
      setAdjustedSystemSize(data.systemSize);
    },
  });

  // Calculate system size on component mount
  useEffect(() => {
    if (dailyUsage && countyId) {
      systemSizeMutation.mutate({
        dailyUsage,
        countyId,
        includeStorage,
      });
    }
  }, [dailyUsage, countyId, includeStorage]);

  const handleContinue = () => {
    if (systemSizeMutation.data && adjustedSystemSize) {
      onContinue({
        ...systemSizeMutation.data,
        systemSize: adjustedSystemSize,
        includeStorage,
      });
    }
  };

  const monthlyGridCost = dailyUsage * 30 * 25; // 25 KSh per kWh

  const isLoading = systemSizeMutation.isPending;
  const isError = systemSizeMutation.isError;
  const data = systemSizeMutation.data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Solar System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-neutral-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-neutral-700">
                    Daily Consumption
                  </h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-neutral-500"
                        >
                          <InfoIcon className="h-4 w-4" />
                          <span className="sr-only">Info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          Your estimated daily electricity usage
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatNumber(dailyUsage)}{" "}
                  <span className="text-lg font-medium">kWh</span>
                </p>
                <p className="text-sm text-neutral-600">
                  Based on your appliance selection
                </p>
              </div>

              <div className="bg-neutral-100 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-neutral-700">Monthly Bill</h4>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-neutral-500"
                        >
                          <InfoIcon className="h-4 w-4" />
                          <span className="sr-only">Info</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">
                          Your estimated monthly electricity cost
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(monthlyGridCost)}
                </p>
                <p className="text-sm text-neutral-600">
                  Based on Kenya Power tariffs
                </p>
              </div>
            </div>

            <div className="bg-neutral-100 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-neutral-700">
                  Recommended System Size
                </h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-neutral-500"
                      >
                        <InfoIcon className="h-4 w-4" />
                        <span className="sr-only">Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">
                        Calculated based on your usage and location's solar
                        irradiance
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : isError ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Failed to calculate system size. Please try again.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex items-end mb-2">
                    <p className="text-3xl font-bold text-primary">
                      {formatNumber(adjustedSystemSize || systemSize || 0)}{" "}
                      <span className="text-xl font-medium">kWp</span>
                    </p>
                    <p className="ml-2 mb-1 text-sm text-success font-medium">
                      (Optimal for your needs)
                    </p>
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    Based on solar irradiance in {countyName} County
                  </p>

                  <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded p-3 mb-3">
                    <div>
                      <h5 className="font-medium">Solar Panels</h5>
                      <p className="text-sm text-neutral-600">
                        {data?.panelCount} x 400W Monocrystalline Panels
                      </p>
                    </div>
                    <span className="mt-2 md:mt-0 text-primary font-medium">
                      {formatNumber(adjustedSystemSize || systemSize || 0)} kWp
                      Total
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded p-3 mb-3">
                    <div>
                      <h5 className="font-medium">Inverter</h5>
                      <p className="text-sm text-neutral-600">
                        {data?.inverterSize} kW Hybrid Inverter
                      </p>
                    </div>
                    <span className="mt-2 md:mt-0 text-primary font-medium">
                      1 Unit
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between bg-white rounded p-3">
                    <div>
                      <h5 className="font-medium">Battery Storage</h5>
                      <p className="text-sm text-neutral-600">
                        {includeStorage
                          ? `${data?.batterySize} kWh Lithium Battery System`
                          : "No battery storage selected"}
                      </p>
                    </div>
                    <span className="mt-2 md:mt-0 text-primary font-medium flex items-center">
                      {includeStorage ? (
                        "Included"
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIncludeStorage(true)}
                        >
                          Add Storage
                        </Button>
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Adjust System Size (Optional)</h4>
              <div className="flex items-center space-x-4">
                <Slider
                  min={systemSize ? Math.max(1, systemSize * 0.7) : 1}
                  max={systemSize ? systemSize * 1.3 : 10}
                  step={0.1}
                  value={[adjustedSystemSize || systemSize || 5]}
                  onValueChange={(value) => setAdjustedSystemSize(value[0])}
                  disabled={isLoading || isError}
                  className="w-full"
                />
                <div className="flex items-center space-x-2 min-w-[80px]">
                  <Input
                    type="number"
                    value={formatNumber(adjustedSystemSize || systemSize || 0, 1)}
                    min={systemSize ? Math.max(1, systemSize * 0.7) : 1}
                    max={systemSize ? systemSize * 1.3 : 10}
                    step={0.1}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value)) {
                        setAdjustedSystemSize(value);
                      }
                    }}
                    disabled={isLoading || isError}
                    className="w-16 p-2 border border-neutral-300 rounded text-center"
                  />
                  <span className="text-neutral-600">kWp</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                disabled={isLoading || isError || !adjustedSystemSize}
              >
                Continue to Cost Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <SummaryPanel
          location={countyName}
          irradiance={irradiance}
          peakSunHours={peakSunHours}
          dailyUsage={dailyUsage}
          systemSize={adjustedSystemSize || systemSize}
          includeStorage={includeStorage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
