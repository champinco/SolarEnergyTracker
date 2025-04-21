import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Download, FileText } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

export interface ROIChartProps {
  systemSize: number;
  systemCost: number;
  dailyUsage: number;
  countyId: number;
  onBack: () => void;
  onGenerateReport: (roiData: any) => void;
}

export function ROIChart({
  systemSize,
  systemCost,
  dailyUsage,
  countyId,
  onBack,
  onGenerateReport,
}: ROIChartProps) {
  const [activeTab, setActiveTab] = useState("yearly");

  const roiMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculate/roi", data);
      return response.json();
    },
  });

  useEffect(() => {
    roiMutation.mutate({
      systemSize,
      systemCost,
      dailyUsage,
      electricityRate: 25, // KSh per kWh
      countyId,
      annualIncrease: 5, // 5% annual increase in electricity costs
    });
  }, [systemSize, systemCost, dailyUsage, countyId]);

  const handleGenerateReport = () => {
    if (roiMutation.data) {
      onGenerateReport({
        ...roiMutation.data,
        systemSize,
        systemCost,
      });
    }
  };

  const isLoading = roiMutation.isPending;
  const isError = roiMutation.isError;
  const data = roiMutation.data;

  const generateSummaryStats = () => {
    if (!data) return null;

    const { paybackPeriod, monthlySavings, annualSavings, twentyYearSavings } = data;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-neutral-50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Payback Period
            </h3>
            <p className="text-2xl font-bold text-primary">
              {paybackPeriod.toFixed(1)} <span className="text-lg">Years</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Monthly Savings
            </h3>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(monthlySavings)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              Annual Savings
            </h3>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(annualSavings)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50">
          <CardContent className="pt-6">
            <h3 className="text-sm font-medium text-neutral-600 mb-1">
              25-Year Savings
            </h3>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(twentyYearSavings)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Return on Investment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-[400px] w-full" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to calculate ROI. Please try again.
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {generateSummaryStats()}

              <Tabs
                defaultValue="yearly"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="yearly">Yearly Comparison</TabsTrigger>
                  <TabsTrigger value="cumulative">Cumulative Savings</TabsTrigger>
                  <TabsTrigger value="breakeven">Breakeven Point</TabsTrigger>
                </TabsList>

                <TabsContent value="yearly" className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {data && data.yearByYearAnalysis ? (
                        <BarChart
                          data={data.yearByYearAnalysis.slice(0, 10)} // Show first 10 years
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="year"
                            label={{
                              value: "Year",
                              position: "insideBottom",
                              offset: -5,
                            }}
                          />
                          <YAxis
                            tickFormatter={(value) =>
                              `${(value / 1000).toFixed(0)}K`
                            }
                            label={{
                              value: "Cost (KSh)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value: any) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                          <Bar
                            name="Grid Electricity Cost"
                            dataKey="gridCost"
                            fill="#f44336"
                          />
                          <Bar
                            name="Solar System Cost (incl. maintenance)"
                            dataKey="solarCost"
                            fill="#4caf50"
                          />
                        </BarChart>
                      ) : (
                        <Skeleton className="h-full w-full" />
                      )}
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="cumulative" className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {data && data.yearByYearAnalysis ? (
                        <AreaChart
                          data={data.yearByYearAnalysis}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="year"
                            label={{
                              value: "Year",
                              position: "insideBottom",
                              offset: -5,
                            }}
                          />
                          <YAxis
                            tickFormatter={(value) =>
                              `${(value / 1000000).toFixed(1)}M`
                            }
                            label={{
                              value: "Cumulative Savings (KSh)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value: any) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="cumulativeSavings"
                            name="Cumulative Savings"
                            fill="#0066CC"
                            stroke="#0066CC"
                          />
                        </AreaChart>
                      ) : (
                        <Skeleton className="h-full w-full" />
                      )}
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="breakeven" className="pt-4">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      {data && data.yearByYearAnalysis && data.paybackPeriod ? (
                        <LineChart
                          data={data.yearByYearAnalysis.slice(
                            0,
                            Math.ceil(data.paybackPeriod) + 3
                          )} // Show until breakeven + 3 years
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="year"
                            label={{
                              value: "Year",
                              position: "insideBottom",
                              offset: -5,
                            }}
                          />
                          <YAxis
                            tickFormatter={(value) =>
                              `${(value / 1000).toFixed(0)}K`
                            }
                            label={{
                              value: "Amount (KSh)",
                              angle: -90,
                              position: "insideLeft",
                            }}
                          />
                          <Tooltip
                            formatter={(value: any) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="cumulativeSavings"
                            name="Cumulative Savings"
                            stroke="#0066CC"
                            dot={{ r: 4 }}
                            activeDot={{ r: 8 }}
                          />
                          {/* Add a line at y=0 to show breakeven point */}
                          <Line
                            type="monotone"
                            dataKey={() => 0}
                            name="Breakeven Point"
                            stroke="#FF9800"
                            strokeDasharray="5 5"
                            dot={false}
                          />
                        </LineChart>
                      ) : (
                        <Skeleton className="h-full w-full" />
                      )}
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-neutral-100 p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2">Analysis Summary</h3>
                {data && data.paybackPeriod && data.annualSavings && data.twentyYearSavings ? (
                  <>
                    <p className="text-sm text-neutral-700 mb-3">
                      Your {systemSize} kWp solar system will pay for itself in{" "}
                      <strong>{data.paybackPeriod.toFixed(1)} years</strong>. After
                      that, you'll save approximately{" "}
                      <strong>{formatCurrency(data.annualSavings)}</strong> per year
                      on electricity costs.
                    </p>
                    <p className="text-sm text-neutral-700 mb-3">
                      Over 25 years, your total savings will be approximately{" "}
                      <strong>
                        {formatCurrency(data.twentyYearSavings)}
                      </strong>, which is{" "}
                      <strong>
                        {(data.twentyYearSavings / systemCost).toFixed(1)}x
                      </strong>{" "}
                      your initial investment!
                    </p>
                  </>
                ) : (
                  <Skeleton className="h-20 w-full" />
                )}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Generate PDF Report
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
