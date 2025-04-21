import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CloudSun } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { createApiUrl } from "@/lib/utils";

export interface LocationSelectorProps {
  selectedCountyId?: number;
  onCountySelect: (countyId: number) => void;
}

export function LocationSelector({
  selectedCountyId,
  onCountySelect,
}: LocationSelectorProps) {
  const [irradiance, setIrradiance] = useState<number | null>(null);
  const [peakSunHours, setPeakSunHours] = useState<number | null>(null);

  // Fetch all counties
  const countiesQuery = useQuery({
    queryKey: [createApiUrl("/counties")],
  });

  // Fetch selected county details if ID is provided
  const countyDetailsQuery = useQuery({
    queryKey: [createApiUrl(`/counties/${selectedCountyId}`)],
    enabled: !!selectedCountyId,
  });

  // Update solar data when county details are loaded
  useEffect(() => {
    if (countyDetailsQuery.data) {
      setIrradiance(countyDetailsQuery.data.irradiance);
      setPeakSunHours(countyDetailsQuery.data.peakSunHours);
    } else {
      setIrradiance(null);
      setPeakSunHours(null);
    }
  }, [countyDetailsQuery.data]);

  const handleCountyChange = (value: string) => {
    const countyId = parseInt(value);
    onCountySelect(countyId);
  };

  const counties = countiesQuery.data || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Your Location</h3>
        <p className="text-neutral-600 text-sm">
          Choose your county to get accurate solar data for your location
        </p>

        {countiesQuery.isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : countiesQuery.isError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load counties. Please try again.
            </AlertDescription>
          </Alert>
        ) : (
          <Select
            value={selectedCountyId?.toString()}
            onValueChange={handleCountyChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a county" />
            </SelectTrigger>
            <SelectContent>
              {counties.map((county: any) => (
                <SelectItem key={county.id} value={county.id.toString()}>
                  {county.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCountyId && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CloudSun className="mr-2 h-5 w-5 text-primary" />
              Solar Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            {countyDetailsQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            ) : countyDetailsQuery.isError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load solar data. Please try again.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-neutral-600">Solar Irradiance</div>
                  <div className="flex items-end space-x-1">
                    <span className="text-xl font-semibold text-primary">
                      {formatNumber(irradiance || 0)}
                    </span>
                    <span className="text-sm text-neutral-600">kWh/m²/day</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Average annual value
                  </div>
                </div>

                <div>
                  <div className="text-sm text-neutral-600">Peak Sun Hours</div>
                  <div className="flex items-end space-x-1">
                    <span className="text-xl font-semibold text-primary">
                      {formatNumber(peakSunHours || 0)}
                    </span>
                    <span className="text-sm text-neutral-600">hours/day</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
