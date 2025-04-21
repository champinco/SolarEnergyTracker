import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatCurrency } from "@/lib/utils";
import { FileText, Download, Mail, Printer, Share2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
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

interface PDFReportProps {
  energyData: any;
  locationData: any;
  systemData: any;
  roiData: any;
  onBack: () => void;
}

export function PDFReport({
  energyData,
  locationData,
  systemData,
  roiData,
  onBack,
}: PDFReportProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Simulate PDF generation delay
    setTimeout(() => {
      setIsGenerating(false);
      
      // In a real implementation, we would use a library like react-to-pdf
      // to generate the PDF from the reportRef element
      alert("PDF Download functionality would be implemented here with react-to-pdf");
    }, 1500);
  };

  const handleEmailReport = () => {
    alert("Email functionality would be implemented here");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Solar Report",
        text: "Check out my solar system report from SolarConnect",
        url: window.location.href,
      });
    } else {
      alert("Web Share API not supported on this browser");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-heading font-bold">Your Solar Report</h3>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleDownload} disabled={isGenerating} className="gap-2">
            {isGenerating ? (
              "Generating..."
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <Button variant="outline" onClick={handleEmailReport} className="gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Button>
        <Button variant="outline" onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      <Card className="print:shadow-none" ref={reportRef}>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="text-right">
              <p className="text-sm text-neutral-600">Report Date:</p>
              <p className="font-medium">
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">
                Solar System Report
              </h2>
              <p className="text-neutral-600">
                This report provides a comprehensive analysis of your solar energy requirements, 
                recommended system specifications, and return on investment projections.
              </p>
            </div>

            {/* Project Summary */}
            <div>
              <h3 className="text-xl font-heading font-semibold border-b pb-2 mb-4">
                Project Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Energy Profile</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-neutral-600">Daily Consumption:</td>
                        <td className="py-2 text-right font-medium">
                          {formatNumber(energyData.dailyUsage)} kWh
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-neutral-600">Monthly Consumption:</td>
                        <td className="py-2 text-right font-medium">
                          {formatNumber(energyData.monthlyUsage)} kWh
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-neutral-600">Annual Consumption:</td>
                        <td className="py-2 text-right font-medium">
                          {formatNumber(energyData.dailyUsage * 365)} kWh
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-neutral-600">Current Monthly Bill:</td>
                        <td className="py-2 text-right font-medium">
                          {formatCurrency(energyData.monthlyBill)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Location Data</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-neutral-600">Location:</td>
                        <td className="py-2 text-right font-medium">
                          {locationData.countyName} County, Kenya
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-neutral-600">Solar Irradiance:</td>
                        <td className="py-2 text-right font-medium">
                          {formatNumber(locationData.irradiance)} kWh/m²/day
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 text-neutral-600">Peak Sun Hours:</td>
                        <td className="py-2 text-right font-medium">
                          {formatNumber(locationData.peakSunHours)} hours/day
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* System Specifications */}
            <div>
              <h3 className="text-xl font-heading font-semibold border-b pb-2 mb-4">
                System Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-700 mb-1">System Size</h4>
                  <p className="text-2xl font-bold text-primary">
                    {formatNumber(systemData.systemSize)} kWp
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-700 mb-1">
                    Estimated Cost
                  </h4>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(systemData.averageCost)}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-700 mb-1">
                    Components
                  </h4>
                  <p className="text-lg font-medium">
                    {systemData.panelCount} Panels
                  </p>
                  <p className="text-sm text-neutral-600">
                    {systemData.inverterSize} kW Inverter
                  </p>
                </div>
              </div>

              <h4 className="font-medium mb-2">System Details</h4>
              <table className="w-full text-sm mb-4">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-neutral-600">Solar Panels:</td>
                    <td className="py-2 text-right font-medium">
                      {systemData.panelCount} x 400W Monocrystalline Panels
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-neutral-600">Inverter:</td>
                    <td className="py-2 text-right font-medium">
                      {systemData.inverterSize} kW Hybrid Inverter
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-neutral-600">Battery Storage:</td>
                    <td className="py-2 text-right font-medium">
                      {systemData.includeStorage
                        ? `${systemData.batterySize} kWh Lithium Battery System`
                        : "Not included"}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-neutral-600">Roof Space Required:</td>
                    <td className="py-2 text-right font-medium">
                      ~{formatNumber(systemData.systemSize * 6)} m²
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-neutral-600">Daily Generation:</td>
                    <td className="py-2 text-right font-medium">
                      ~{formatNumber(systemData.dailyProduction)} kWh
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Financial Analysis */}
            <div>
              <h3 className="text-xl font-heading font-semibold border-b pb-2 mb-4">
                Financial Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">
                    Payback Period
                  </h4>
                  <p className="text-xl font-bold text-primary">
                    {roiData.paybackPeriod.toFixed(1)} Years
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">
                    Monthly Savings
                  </h4>
                  <p className="text-xl font-bold text-secondary">
                    {formatCurrency(roiData.monthlySavings)}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">
                    Annual Savings
                  </h4>
                  <p className="text-xl font-bold text-secondary">
                    {formatCurrency(roiData.annualSavings)}
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-neutral-700 mb-1">
                    25-Year Savings
                  </h4>
                  <p className="text-xl font-bold text-secondary">
                    {formatCurrency(roiData.twentyYearSavings)}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="comparison" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="comparison">Cost Comparison</TabsTrigger>
                  <TabsTrigger value="cumulative">Cumulative Savings</TabsTrigger>
                </TabsList>
                <TabsContent value="comparison" className="pt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={roiData.yearByYearAnalysis.slice(0, 8)}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis
                          tickFormatter={(value) =>
                            `${(value / 1000).toFixed(0)}K`
                          }
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
                          name="Solar System Cost"
                          dataKey="solarCost"
                          fill="#4caf50"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                <TabsContent value="cumulative" className="pt-4">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={roiData.yearByYearAnalysis}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(1)}M`
                          }
                        />
                        <Tooltip
                          formatter={(value: any) =>
                            formatCurrency(value as number)
                          }
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeSavings"
                          name="Cumulative Savings"
                          fill="#0066CC"
                          stroke="#0066CC"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Environmental Impact */}
            <div>
              <h3 className="text-xl font-heading font-semibold border-b pb-2 mb-4">
                Environmental Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-700 mb-2">
                    Carbon Offset (25 Years)
                  </h4>
                  <p className="text-2xl font-bold text-secondary mb-1">
                    {formatNumber(systemData.systemSize * 365 * 25 * 0.5)} kg CO₂
                  </p>
                  <p className="text-sm text-neutral-600">
                    Equivalent to planting approximately{" "}
                    {formatNumber((systemData.systemSize * 365 * 25 * 0.5) / 25)} trees
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-700 mb-2">
                    Renewable Energy Generated (25 Years)
                  </h4>
                  <p className="text-2xl font-bold text-secondary mb-1">
                    {formatNumber(
                      systemData.systemSize *
                        locationData.peakSunHours *
                        365 *
                        25 *
                        0.8
                    )}{" "}
                    kWh
                  </p>
                  <p className="text-sm text-neutral-600">
                    Clean, renewable electricity produced over system lifetime
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="text-xl font-heading font-semibold border-b pb-2 mb-4">
                Next Steps
              </h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Connect with one of our verified installers for a site visit and
                  detailed quote.
                </li>
                <li>
                  Get a professional roof assessment to confirm suitability for solar
                  installation.
                </li>
                <li>
                  Explore financing options with our partner banks and institutions.
                </li>
                <li>
                  Begin your installation process and start enjoying clean, renewable
                  energy!
                </li>
              </ol>
            </div>

            {/* Disclaimer */}
            <div className="text-xs text-neutral-500 border-t pt-4 mt-8">
              <p>
                <strong>Disclaimer:</strong> This report provides estimates based on
                the information provided and general assumptions about solar
                performance in Kenya. Actual results may vary based on final system
                design, installation quality, weather patterns, and changes in
                electricity rates. We recommend consulting with a certified solar
                installer for a detailed site assessment and customized proposal.
              </p>
            </div>

            <div className="text-center text-sm text-neutral-600 pt-2">
              <p>Generated by SolarConnect | www.solarconnect.co.ke</p>
              <p>© {new Date().getFullYear()} SolarConnect. All rights reserved.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
