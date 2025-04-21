import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronRight, FileText, HelpCircle, Book, Lightbulb } from "lucide-react";

export default function Resources() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mb-2">
          Solar Resources
        </h2>
        <p className="text-neutral-700">
          Learn more about solar energy and making the switch to clean power
        </p>
      </div>

      <Tabs defaultValue="guides" className="mb-10">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tips">Energy Tips</TabsTrigger>
          <TabsTrigger value="financing">Financing</TabsTrigger>
        </TabsList>

        <TabsContent value="guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Complete Solar Guide for Beginners",
                description:
                  "Everything you need to know about solar power systems before making the switch",
                icon: <Book className="h-6 w-6 text-primary" />,
              },
              {
                title: "Understanding Solar System Components",
                description:
                  "Learn about panels, inverters, batteries and other critical parts of a solar system",
                icon: <FileText className="h-6 w-6 text-primary" />,
              },
              {
                title: "Grid-Tied vs Off-Grid Solar",
                description:
                  "Compare the different types of solar systems and find what's right for you",
                icon: <FileText className="h-6 w-6 text-primary" />,
              },
              {
                title: "Solar Maintenance Guide",
                description:
                  "How to maintain your solar system for optimal performance and longevity",
                icon: <FileText className="h-6 w-6 text-primary" />,
              },
              {
                title: "Solar Policies in Kenya",
                description:
                  "Current regulations, incentives and policies related to solar energy in Kenya",
                icon: <FileText className="h-6 w-6 text-primary" />,
              },
              {
                title: "Commercial Solar Guide",
                description:
                  "Special considerations for businesses looking to invest in solar energy",
                icon: <FileText className="h-6 w-6 text-primary" />,
              },
            ].map((guide, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start">
                    {guide.icon}
                    <CardTitle className="text-lg ml-2">{guide.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-neutral-600">
                    {guide.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="link" className="p-0 h-auto">
                    Read More <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  question: "How much does a solar system cost in Kenya?",
                  answer:
                    "The cost of a solar system in Kenya typically ranges from KSh 120,000 to KSh 200,000 per kWp installed, depending on the quality of components, system type, and installation complexity. For a standard 5kWp residential system, you can expect to pay between KSh 600,000 to KSh 1,000,000.",
                },
                {
                  question: "How long do solar panels last?",
                  answer:
                    "Quality solar panels typically have a lifespan of 25-30 years. Most manufacturers provide performance warranties guaranteeing at least 80% of the original output after 25 years. The inverter usually has a shorter lifespan of 10-15 years and may need replacement during the panel's lifetime.",
                },
                {
                  question: "Will solar work during power outages?",
                  answer:
                    "Grid-tied solar systems without batteries will shut down during a power outage for safety reasons. If you want power during outages, you'll need either a hybrid system with battery backup or an off-grid system that operates independently from the utility grid.",
                },
                {
                  question: "How much roof space do I need for solar panels?",
                  answer:
                    "As a general rule, you need approximately 6-10 square meters of roof space per kWp of solar capacity. A typical 5kWp system would require about 30-50 square meters of unshaded roof area, depending on the efficiency of the panels used.",
                },
                {
                  question: "What maintenance do solar systems require?",
                  answer:
                    "Solar systems require minimal maintenance. Panels should be cleaned 2-4 times per year to remove dust and debris, especially during dry seasons. It's also recommended to have a professional inspection annually to check electrical connections and system performance.",
                },
              ].map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium text-lg">{faq.question}</h3>
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Energy Efficiency Tips",
                items: [
                  "Switch to LED lighting to reduce consumption by up to 80%",
                  "Use energy-efficient appliances with high star ratings",
                  "Install timers or smart controls for lighting and appliances",
                  "Use ceiling fans instead of air conditioners when possible",
                  "Keep refrigerator coils clean and maintain proper temperature",
                  "Unplug electronics when not in use to avoid phantom loads",
                ],
              },
              {
                title: "Solar System Optimization",
                items: [
                  "Position panels facing north or northeast for maximum exposure",
                  "Ensure panels are installed at the optimal tilt angle (10-15° in Kenya)",
                  "Keep panels clean from dust, leaves and bird droppings",
                  "Trim trees or obstacles that cause shading on panels",
                  "Schedule major electricity usage during peak sunlight hours",
                  "Monitor system performance regularly to catch issues early",
                ],
              },
              {
                title: "Cost-Saving Strategies",
                items: [
                  "Consider a grid-tied system first if you're on a budget",
                  "Start with a smaller system that can be expanded later",
                  "Apply for available tax incentives or exemptions",
                  "Compare quotes from multiple installers before deciding",
                  "Look into solar lease or pay-as-you-go options if upfront costs are high",
                  "Consider community or shared solar options if available",
                ],
              },
            ].map((tipGroup, index) => (
              <Card key={index} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle>{tipGroup.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {tipGroup.items.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-neutral-700">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Solar Financing Options in Kenya
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Cash Purchase</h3>
                <p className="text-neutral-600">
                  Paying upfront for your solar system provides the highest long-term
                  returns and lowest overall cost. While requiring a significant initial
                  investment, this option eliminates financing costs and allows you to
                  take full advantage of any available tax benefits.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Bank Loans</h3>
                <p className="text-neutral-600">
                  Several Kenyan banks offer green energy loans specifically for solar
                  installations. These loans typically have terms of 3-7 years with
                  competitive interest rates. Some institutions offering solar loans
                  include Kenya Commercial Bank (KCB), Cooperative Bank, and Equity Bank.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Pay-As-You-Go (PAYG)</h3>
                <p className="text-neutral-600">
                  PAYG systems allow you to pay for your solar system in small,
                  manageable installments, often through mobile money. You receive the
                  system after a small deposit and make regular payments until you own it
                  outright. Companies like M-KOPA, d.light, and Azuri Technologies offer
                  these options.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Solar Lease/PPA</h3>
                <p className="text-neutral-600">
                  Some companies in Kenya offer solar leases or Power Purchase Agreements
                  (PPAs) where you pay a monthly fee for the solar equipment or for the
                  power generated. These options require little to no money down but may
                  have longer contract terms (10-20 years).
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-lg">Microfinance and SACCOs</h3>
                <p className="text-neutral-600">
                  Microfinance institutions and Savings and Credit Cooperative
                  Organizations (SACCOs) often provide smaller, more accessible loans for
                  solar systems with favorable terms for their members. These can be good
                  options for smaller systems or for those who may not qualify for
                  traditional bank loans.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
