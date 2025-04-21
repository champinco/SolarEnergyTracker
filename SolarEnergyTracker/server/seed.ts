import { db } from './db';
import { appliances, counties, installers } from '@shared/schema';

/**
 * Seed the database with initial data
 */
async function seed() {
  console.log('Seeding database...');
  
  // Add sample appliances
  const sampleAppliances = [
    {
      name: "LED Light Bulb",
      category: "residential",
      power: 10,
      hourlyUsage: 5,
      iconName: "lightbulb",
      description: "Energy efficient light bulb"
    },
    {
      name: "Ceiling Fan",
      category: "residential",
      power: 75,
      hourlyUsage: 8,
      iconName: "fan",
      description: "Standard ceiling fan"
    },
    {
      name: "Refrigerator",
      category: "residential",
      power: 150,
      hourlyUsage: 24,
      iconName: "refrigerator",
      description: "Medium-sized refrigerator"
    },
    {
      name: "Television (32\")",
      category: "residential",
      power: 55,
      hourlyUsage: 4,
      iconName: "tv",
      description: "32-inch LED TV"
    },
    {
      name: "Laptop",
      category: "residential",
      power: 50,
      hourlyUsage: 4,
      iconName: "laptop",
      description: "Standard laptop computer"
    },
    {
      name: "Air Conditioner (1 ton)",
      category: "residential",
      power: 1000,
      hourlyUsage: 6,
      iconName: "air-conditioner",
      description: "1-ton air conditioner unit"
    },
    {
      name: "Office Computer",
      category: "commercial",
      power: 150,
      hourlyUsage: 8,
      iconName: "computer",
      description: "Desktop computer for office use"
    },
    {
      name: "Photocopier",
      category: "commercial",
      power: 1100,
      hourlyUsage: 2,
      iconName: "printer",
      description: "Standard office photocopier"
    },
    {
      name: "Commercial Refrigerator",
      category: "commercial",
      power: 350,
      hourlyUsage: 24,
      iconName: "refrigerator",
      description: "Commercial refrigerator unit"
    },
    {
      name: "Industrial Motor (5hp)",
      category: "industrial",
      power: 3700,
      hourlyUsage: 6,
      iconName: "tool",
      description: "5hp industrial motor"
    },
    {
      name: "Welding Machine",
      category: "industrial",
      power: 4500,
      hourlyUsage: 3,
      iconName: "zap",
      description: "Standard welding machine"
    }
  ];
  
  // Add Kenya counties with solar data
  const sampleCounties = [
    { name: "Nairobi", irradiance: 5.6, peakSunHours: 5.2 },
    { name: "Mombasa", irradiance: 5.8, peakSunHours: 5.5 },
    { name: "Kisumu", irradiance: 5.4, peakSunHours: 5.0 },
    { name: "Nakuru", irradiance: 5.7, peakSunHours: 5.3 },
    { name: "Kiambu", irradiance: 5.5, peakSunHours: 5.2 },
    { name: "Machakos", irradiance: 5.9, peakSunHours: 5.6 },
    { name: "Kajiado", irradiance: 6.1, peakSunHours: 5.8 },
    { name: "Garissa", irradiance: 6.3, peakSunHours: 6.0 },
    { name: "Turkana", irradiance: 6.4, peakSunHours: 6.1 }
  ];
  
  // Add sample installers
  const sampleInstallers = [
    {
      name: "SunPower Kenya",
      description: "Premium solar installations for residential and commercial clients",
      email: "info@sunpowerkenya.com",
      phone: "+254722111222",
      website: "https://www.sunpowerkenya.com",
      address: "Westlands, Nairobi",
      countyIds: [1, 5, 6],
      services: ["Residential", "Commercial", "Maintenance"],
      verified: true,
      rating: 4.8
    },
    {
      name: "GreenLight Solar",
      description: "Affordable solar solutions with quality components",
      email: "support@greenlightsolar.co.ke",
      phone: "+254733444555",
      website: "https://www.greenlightsolar.co.ke",
      address: "Industrial Area, Nairobi",
      countyIds: [1, 2, 4],
      services: ["Residential", "Industrial", "Maintenance"],
      verified: true,
      rating: 4.5
    },
    {
      name: "Mombasa Solar Experts",
      description: "Coast region specialists with over 10 years experience",
      email: "hello@mombasasolar.co.ke",
      phone: "+254711888999",
      website: "https://www.mombasasolar.co.ke",
      address: "Nyali, Mombasa",
      countyIds: [2],
      services: ["Residential", "Commercial", "Off-grid"],
      verified: false,
      rating: 4.2
    }
  ];

  try {
    // Check if we already have data
    const existingAppliances = await db.select().from(appliances);
    if (existingAppliances.length === 0) {
      console.log('Seeding appliances...');
      await db.insert(appliances).values(sampleAppliances);
    } else {
      console.log('Appliances already seeded, skipping...');
    }

    const existingCounties = await db.select().from(counties);
    if (existingCounties.length === 0) {
      console.log('Seeding counties...');
      await db.insert(counties).values(sampleCounties);
    } else {
      console.log('Counties already seeded, skipping...');
    }

    const existingInstallers = await db.select().from(installers);
    if (existingInstallers.length === 0) {
      console.log('Seeding installers...');
      await db.insert(installers).values(sampleInstallers);
    } else {
      console.log('Installers already seeded, skipping...');
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed().catch(console.error);