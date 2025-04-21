import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { createApiUrl, formatNumber } from "@/lib/utils";
import { ApplianceItem } from "./appliance-item";
import { BillUpload } from "./bill-upload";
import { apiRequest } from "@/lib/queryClient";

interface EnergyUsageProps {
  onSubmit: (data: any) => void;
}

export function EnergyUsage({ onSubmit }: EnergyUsageProps) {
  const [activeTab, setActiveTab] = useState("appliances");
  const [selectedCountyId, setSelectedCountyId] = useState<number | null>(null);
  const [selectedAppliances, setSelectedAppliances] = useState<
    Array<{
      id: number;
      quantity: number;
      hoursPerDay: number;
      dailyUsage: number;
    }>
  >([]);
  const [totalDailyUsage, setTotalDailyUsage] = useState(0);
  const [billAmount, setBillAmount] = useState<number | null>(null);

  // Fetch appliances
  const appliancesQuery = useQuery({
    queryKey: [createApiUrl("/appliances")],
  });

  // Calculate energy usage based on appliances
  const calculateEnergy = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(
        "POST",
        "/api/calculate/energy",
        data
      );
      return response.json();
    },
  });

  // Update total daily usage whenever selected appliances change
  useEffect(() => {
    if (selectedAppliances.length > 0) {
      const total = selectedAppliances.reduce(
        (sum, appliance) => sum + appliance.dailyUsage,
        0
      );
      setTotalDailyUsage(total);
    } else {
      setTotalDailyUsage(0);
    }
  }, [selectedAppliances]);

  // Handle appliance selection/update
  const handleApplianceSelect = (
    id: number,
    quantity: number,
    hoursPerDay: number,
    dailyUsage: number
  ) => {
    if (quantity === 0) {
      // Remove appliance if quantity is 0
      setSelectedAppliances(
        selectedAppliances.filter((appliance) => appliance.id !== id)
      );
    } else {
      // Check if appliance is already selected
      const existingIndex = selectedAppliances.findIndex(
        (appliance) => appliance.id === id
      );

      if (existingIndex !== -1) {
        // Update existing appliance
        const updatedAppliances = [...selectedAppliances];
        updatedAppliances[existingIndex] = {
          id,
          quantity,
          hoursPerDay,
          dailyUsage,
        };
        setSelectedAppliances(updatedAppliances);
      } else {
        // Add new appliance
        setSelectedAppliances([
          ...selectedAppliances,
          { id, quantity, hoursPerDay, dailyUsage },
        ]);
      }
    }
  };

  // Handle bill amount submission
  const handleBillAmountSubmit = (amount: number) => {
    setBillAmount(amount);
    calculateEnergy.mutate({
      billAmount: amount,
      countyId: 1, // Default county (Nairobi) if none selected
    });
  };

  // Handle submission of energy usage data
  const handleSubmit = () => {
    if (activeTab === "appliances" && selectedAppliances.length > 0) {
      calculateEnergy.mutate({
        appliances: selectedAppliances.map(({ id, quantity, hoursPerDay }) => ({
          id,
          quantity,
          hoursPerDay,
        })),
        countyId: 1, // Default county if none selected
      });
    }
  };

  // When calculation is complete, submit the data
  useEffect(() => {
    if (calculateEnergy.isSuccess) {
      onSubmit({
        ...calculateEnergy.data,
        appliances: activeTab === "appliances" ? selectedAppliances : undefined,
      });
    }
  }, [calculateEnergy.isSuccess, calculateEnergy.data]);

  // Group appliances by category
  const groupedAppliances = appliancesQuery.data
    ? appliancesQuery.data.reduce((acc: any, appliance: any) => {
        if (!acc[appliance.category]) {
          acc[appliance.category] = [];
        }
        acc[appliance.category].push(appliance);
        return acc;
      }, {})
    : {};

  const categories = groupedAppliances ? Object.keys(groupedAppliances) : [];

  return (
    <div>
      <Tabs defaultValue="appliances" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appliances">Appliance Selection</TabsTrigger>
          <TabsTrigger value="bill">Bill Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="appliances" className="mt-6">
          {appliancesQuery.isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i}>
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <Skeleton key={j} className="h-[180px]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : appliancesQuery.isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load appliances. Please try again.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-medium capitalize">{category} Appliances</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {groupedAppliances[category].map((appliance: any) => {
                      const selectedAppliance = selectedAppliances.find(
                        (a) => a.id === appliance.id
                      );
                      return (
                        <ApplianceItem
                          key={appliance.id}
                          id={appliance.id}
                          name={appliance.name}
                          power={appliance.power}
                          hourlyUsage={appliance.hourlyUsage}
                          iconName={appliance.iconName}
                          description={appliance.description}
                          onSelect={handleApplianceSelect}
                          isSelected={!!selectedAppliance}
                          initialQuantity={selectedAppliance?.quantity}
                          initialHours={selectedAppliance?.hoursPerDay}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              <Card className="bg-neutral-50">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Total Daily Energy Usage</h3>
                      <p className="text-sm text-neutral-600">
                        Based on your selected appliances
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatNumber(totalDailyUsage)} kWh
                      </div>
                      <p className="text-sm text-neutral-600">
                        {formatNumber(totalDailyUsage * 30)} kWh per month
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={
                      selectedAppliances.length === 0 ||
                      calculateEnergy.isPending
                    }
                  >
                    {calculateEnergy.isPending
                      ? "Calculating..."
                      : "Continue with Selected Appliances"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bill" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Upload Your Electricity Bill</CardTitle>
                <CardDescription>
                  We'll estimate your energy usage based on your monthly bill amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    For more accurate results, please consider using the appliance 
                    selection method, especially if your bill includes additional 
                    charges or adjustments.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <BillUpload onBillAmountSubmit={handleBillAmountSubmit} />

            {calculateEnergy.isError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to calculate energy usage. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
