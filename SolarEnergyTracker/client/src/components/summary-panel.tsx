import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatCurrency } from "@/lib/utils";

export interface SummaryPanelProps {
  location?: string;
  irradiance?: number;
  peakSunHours?: number;
  dailyUsage?: number;
  systemSize?: number | null;
  includeStorage?: boolean;
  isLoading?: boolean;
}

export function SummaryPanel({
  location = "Not selected",
  irradiance = 0,
  peakSunHours = 0,
  dailyUsage = 0,
  systemSize = null,
  includeStorage = false,
  isLoading = false,
}: SummaryPanelProps) {
  const monthlyUsage = dailyUsage * 30;
  const annualUsage = dailyUsage * 365;
  
  // Calculate estimated costs if system size is available
  const estimateSystemCost = () => {
    if (!systemSize) return { min: 0, max: 0, monthly: 0, payback: 0 };
    
    // Base cost per kWp (without batteries)
    const baseCostPerKwp = 120000; // KSh per kWp
    const batteryCost = includeStorage ? systemSize * 80000 : 0;
    
    const baseCost = systemSize * baseCostPerKwp + batteryCost;
    const minCost = Math.round(baseCost * 0.9); // 10% below average
    const maxCost = Math.round(baseCost * 1.2); // 20% above average
    
    // Estimated monthly savings (based on current electricity rates)
    const monthlyBill = monthlyUsage * 25; // 25 KSh per kWh
    
    // Rough payback period calculation
    const avgCost = (minCost + maxCost) / 2;
    const payback = avgCost / (monthlyBill * 12);
    
    return {
      min: minCost,
      max: maxCost,
      monthly: monthlyBill,
      payback: payback,
    };
  };
  
  const costs = estimateSystemCost();

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Project Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-neutral-600 mb-1">Location</h4>
              <p className="font-medium">{location}</p>
            </div>

            <div>
              <h4 className="text-sm text-neutral-600 mb-1">Solar Irradiance</h4>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <>
                  <p className="font-medium">{formatNumber(irradiance)} kWh/m²/day</p>
                  <p className="text-xs text-neutral-500">Average annual value</p>
                </>
              )}
            </div>

            <div>
              <h4 className="text-sm text-neutral-600 mb-1">Peak Sun Hours</h4>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="font-medium">{formatNumber(peakSunHours)} hours/day</p>
              )}
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="text-sm text-neutral-600 mb-1">Energy Profile</h4>
              <div className="flex justify-between my-1">
                <span className="text-sm">Daily Consumption:</span>
                <span className="text-sm font-medium">
                  {formatNumber(dailyUsage)} kWh
                </span>
              </div>
              <div className="flex justify-between my-1">
                <span className="text-sm">Monthly Consumption:</span>
                <span className="text-sm font-medium">
                  {formatNumber(monthlyUsage)} kWh
                </span>
              </div>
              <div className="flex justify-between my-1">
                <span className="text-sm">Annual Consumption:</span>
                <span className="text-sm font-medium">
                  {formatNumber(annualUsage)} kWh
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="text-sm text-neutral-600 mb-1">
                Estimated Costs <span className="text-xs text-neutral-500">(Preliminary)</span>
              </h4>
              {isLoading || !systemSize ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : (
                <>
                  <div className="flex justify-between my-1">
                    <span className="text-sm">System Cost:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(costs.min)} - {formatCurrency(costs.max)}
                    </span>
                  </div>
                  <div className="flex justify-between my-1">
                    <span className="text-sm">Monthly Savings:</span>
                    <span className="text-sm font-medium text-secondary">
                      ~ {formatCurrency(costs.monthly)}
                    </span>
                  </div>
                  <div className="flex justify-between my-1">
                    <span className="text-sm">Payback Period:</span>
                    <span className="text-sm font-medium">
                      {costs.payback.toFixed(0)}-{(costs.payback + 2).toFixed(0)} years
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About System Sizing</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 mb-4">
            The recommended system size is calculated based on your daily energy
            consumption and the solar irradiance at your location. We factor in:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-2 text-neutral-700">
            <li>Your daily electricity usage</li>
            <li>Local solar irradiance data from PVGIS</li>
            <li>System efficiency losses (typically 15-20%)</li>
            <li>Available roof space (if provided)</li>
          </ul>
          <p className="text-neutral-700 mb-4">
            The system includes high-efficiency solar panels, an appropriate
            inverter, mounting hardware, and optional battery storage.
          </p>
          <div className="bg-neutral-100 p-4 rounded-lg">
            <h4 className="font-medium text-neutral-800 mb-2">Need help?</h4>
            <p className="text-sm text-neutral-600 mb-3">
              Our team can provide a more detailed assessment based on your
              specific roof conditions and requirements.
            </p>
            <Button variant="secondary" className="w-full">
              Contact a Specialist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
