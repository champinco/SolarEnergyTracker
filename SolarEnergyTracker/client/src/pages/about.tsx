import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Shield, UserCheck, Globe, Phone, Mail, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-8">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-neutral-900 mb-2">
          About SolarConnect
        </h2>
        <p className="text-neutral-700">
          Empowering Kenyans with solar energy solutions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral max-w-none">
              <p>
                SolarConnect was founded with a clear mission: to make solar
                energy accessible, understandable, and affordable for all
                Kenyans. We believe that by providing accurate information and
                connecting consumers with qualified installers, we can
                accelerate Kenya's transition to clean, renewable energy.
              </p>
              <p>
                Our platform leverages advanced data from the Photovoltaic
                Geographical Information System (PVGIS) and local knowledge to
                deliver precise solar calculations tailored to Kenya's unique
                conditions across all 47 counties.
              </p>
              <p>
                Solar energy presents a tremendous opportunity for Kenya – a
                country blessed with abundant sunshine throughout the year. By
                helping homeowners and businesses make informed decisions about
                solar, we contribute to energy independence, reduced electricity
                costs, and environmental sustainability.
              </p>
              <h3 className="text-xl font-heading font-semibold mt-6">
                What We Offer
              </h3>
              <p>
                Our comprehensive solar calculator allows you to determine your
                optimal solar system size based on your specific energy needs
                and location. We provide detailed ROI analysis that shows you
                exactly how much you can save by switching to solar, and connect
                you with vetted installers who can bring your solar project to
                life.
              </p>
              <p>
                SolarConnect is more than just a calculator – we're your partner
                throughout your solar journey, from initial research to
                installation and beyond.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-4 bg-primary-light p-2 rounded-full">
                    <Sun className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Clean Energy Access</h3>
                    <p className="text-sm text-neutral-600">
                      Making solar energy accessible to all Kenyans regardless of location
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-primary-light p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Data Accuracy</h3>
                    <p className="text-sm text-neutral-600">
                      Providing precise calculations and transparent information
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-primary-light p-2 rounded-full">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Quality Assurance</h3>
                    <p className="text-sm text-neutral-600">
                      Vetting installers to ensure high-quality service
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mr-4 bg-primary-light p-2 rounded-full">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Sustainability</h3>
                    <p className="text-sm text-neutral-600">
                      Promoting renewable energy for a cleaner environment
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-sm text-neutral-600">+254 700 000 000</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-sm text-neutral-600">
                      info@solarconnect.co.ke
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3" />
                  <div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-sm text-neutral-600">
                      Riverside Drive<br />
                      Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
