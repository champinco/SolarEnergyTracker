import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Sun, Coins, Calculator } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-neutral-50">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
                Empower Your Home with Solar Energy
              </h1>
              <p className="text-neutral-700 text-lg mb-8">
                Calculate your optimal solar setup, estimate returns on investment, 
                and connect with qualified installers across Kenya. Take control of 
                your energy future today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/calculator">
                  <Button size="lg" className="gap-2">
                    Start Calculator <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/installers">
                  <Button size="lg" variant="outline">
                    Find Installers
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-primary-light rounded-lg p-6 shadow-lg">
                <div className="aspect-video bg-white rounded-md shadow-sm flex items-center justify-center">
                  <div className="text-center p-8">
                    <Sun className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-heading font-semibold text-lg text-primary">
                      Solar Power Calculator
                    </h3>
                    <p className="text-neutral-600 mt-2">
                      Our interactive tool helps you calculate the perfect solar 
                      system for your energy needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-12">
            Why Choose SolarConnect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="pt-6">
                <Calculator className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">
                  Precise Calculations
                </h3>
                <p className="text-neutral-600">
                  Get accurate solar system sizing based on your unique energy usage 
                  and location data from all 47 counties in Kenya.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="pt-6">
                <Coins className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">
                  Detailed ROI Analysis
                </h3>
                <p className="text-neutral-600">
                  See a year-by-year breakdown of your investment returns and compare 
                  grid vs. solar costs over the lifetime of your system.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="pt-6">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">
                  Verified Installers
                </h3>
                <p className="text-neutral-600">
                  Connect with our network of vetted solar installers in your area 
                  who can bring your solar project to life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-neutral-600 text-center mb-12 max-w-3xl mx-auto">
            Our simple step-by-step process helps you design the perfect solar system 
            for your home or business
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Enter Energy Usage",
                description: "Select your appliances or upload your electricity bill"
              },
              {
                step: 2,
                title: "Choose Location",
                description: "Select your county to get accurate solar data"
              },
              {
                step: 3,
                title: "Review Calculation",
                description: "Get your recommended system size and components"
              },
              {
                step: 4,
                title: "Connect & Save",
                description: "Find installers and download your custom report"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold">{item.step}</span>
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/calculator">
              <Button size="lg">Start Your Solar Journey</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Harness the Power of the Sun?
            </h2>
            <p className="text-white opacity-90 mb-8">
              Start your solar journey today with our free calculator and find out how 
              much you can save with clean, renewable energy.
            </p>
            <Link href="/calculator">
              <Button size="lg" variant="secondary">
                Calculate Your Solar Needs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
