import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  energyCalculationSchema, 
  systemSizingSchema, 
  roiCalculationSchema,
  insertProjectSchema
} from "@shared/schema";
import { calculateService } from "./services/calculate.service";
import { pvgisService } from "./services/pvgis.service";
import { pdfService } from "./services/pdf.service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create API router
  const apiRouter = express.Router();
  
  // Appliance routes
  apiRouter.get("/appliances", async (req, res) => {
    try {
      const { category } = req.query;
      let appliances;
      
      if (category && typeof category === 'string') {
        appliances = await storage.getAppliancesByCategory(category);
      } else {
        appliances = await storage.getAppliances();
      }
      
      res.json(appliances);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appliances" });
    }
  });
  
  apiRouter.get("/appliances/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const appliance = await storage.getAppliance(id);
      
      if (!appliance) {
        return res.status(404).json({ message: "Appliance not found" });
      }
      
      res.json(appliance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appliance" });
    }
  });
  
  // County routes
  apiRouter.get("/counties", async (req, res) => {
    try {
      const counties = await storage.getCounties();
      res.json(counties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch counties" });
    }
  });
  
  apiRouter.get("/counties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const county = await storage.getCounty(id);
      
      if (!county) {
        return res.status(404).json({ message: "County not found" });
      }
      
      // Get enhanced solar data from PVGIS
      const solarData = await pvgisService.getSolarData(county);
      
      res.json({
        ...county,
        irradiance: solarData.irradiance,
        peakSunHours: solarData.peakSunHours,
        monthlyData: solarData.monthlyData
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch county" });
    }
  });
  
  // Installer routes
  apiRouter.get("/installers", async (req, res) => {
    try {
      const { countyId } = req.query;
      let installers;
      
      if (countyId && !isNaN(parseInt(countyId as string))) {
        installers = await storage.getInstallersByCounty(parseInt(countyId as string));
      } else {
        installers = await storage.getInstallers();
      }
      
      res.json(installers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch installers" });
    }
  });
  
  // Get installers for a specific county 
  apiRouter.get("/counties/:id/installers", async (req, res) => {
    try {
      const countyId = parseInt(req.params.id);
      
      if (isNaN(countyId)) {
        return res.status(400).json({ message: "Invalid county ID" });
      }
      
      const county = await storage.getCounty(countyId);
      if (!county) {
        return res.status(404).json({ message: "County not found" });
      }
      
      const installers = await storage.getInstallersByCounty(countyId);
      res.json(installers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch installers for county" });
    }
  });
  
  apiRouter.get("/installers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const installer = await storage.getInstaller(id);
      
      if (!installer) {
        return res.status(404).json({ message: "Installer not found" });
      }
      
      res.json(installer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch installer" });
    }
  });
  
  // Calculate routes
  apiRouter.post("/calculate/energy", async (req, res) => {
    try {
      const data = energyCalculationSchema.parse(req.body);
      
      let dailyUsage: number;
      
      if (data.appliances && data.appliances.length > 0) {
        // Get full appliance details from storage
        const appliancesWithDetails = await Promise.all(
          data.appliances.map(async (item) => {
            const appliance = await storage.getAppliance(item.id);
            
            if (!appliance) {
              throw new Error(`Appliance not found: ${item.id}`);
            }
            
            return {
              ...appliance,
              quantity: item.quantity,
              hoursPerDay: item.hoursPerDay || appliance.hourlyUsage
            };
          })
        );
        
        dailyUsage = calculateService.calculateDailyUsage(appliancesWithDetails);
      } else if (data.billAmount) {
        dailyUsage = calculateService.estimateUsageFromBill(data.billAmount);
      } else {
        return res.status(400).json({
          message: "Either appliances or billAmount must be provided"
        });
      }
      
      const monthlyUsage = dailyUsage * 30;
      const annualUsage = dailyUsage * 365;
      
      // Calculate monthly bill (estimated)
      const avgElectricityRate = 25; // KSh per kWh
      const monthlyBill = monthlyUsage * avgElectricityRate;
      
      res.json({
        dailyUsage,
        monthlyUsage,
        annualUsage,
        monthlyBill
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: fromZodError(error).message
        });
      }
      
      res.status(500).json({
        message: "Failed to calculate energy usage"
      });
    }
  });
  
  apiRouter.post("/calculate/system", async (req, res) => {
    try {
      const data = systemSizingSchema.parse(req.body);
      
      const systemDetails = await calculateService.calculateSystemSize(data);
      const costEstimate = calculateService.calculateSystemCost(
        systemDetails.systemSize, 
        data.includeStorage
      );
      
      res.json({
        ...systemDetails,
        ...costEstimate
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: fromZodError(error).message
        });
      }
      
      res.status(500).json({
        message: "Failed to calculate system size"
      });
    }
  });
  
  apiRouter.post("/calculate/roi", async (req, res) => {
    try {
      const data = roiCalculationSchema.parse(req.body);
      
      const roiAnalysis = calculateService.calculateROI(data);
      
      res.json(roiAnalysis);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: fromZodError(error).message
        });
      }
      
      res.status(500).json({
        message: "Failed to calculate ROI"
      });
    }
  });
  
  // Project routes
  apiRouter.post("/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      
      const project = await storage.createProject(projectData);
      
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: fromZodError(error).message
        });
      }
      
      res.status(500).json({
        message: "Failed to create project"
      });
    }
  });
  
  apiRouter.get("/projects", async (req, res) => {
    try {
      const { userId } = req.query;
      let projects;
      
      if (userId && !isNaN(parseInt(userId as string))) {
        projects = await storage.getProjects(parseInt(userId as string));
      } else {
        projects = await storage.getProjects();
      }
      
      res.json(projects);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch projects"
      });
    }
  });
  
  apiRouter.get("/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch project"
      });
    }
  });
  
  apiRouter.get("/projects/:id/report", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({
          message: "Project not found"
        });
      }
      
      const county = await storage.getCounty(project.countyId);
      
      if (!county) {
        return res.status(404).json({
          message: "County not found"
        });
      }
      
      // Generate report data
      const reportData = pdfService.generateReportData(project, county);
      
      res.json(reportData);
    } catch (error) {
      res.status(500).json({
        message: "Failed to generate report"
      });
    }
  });
  
  // Bill processing route
  apiRouter.post("/billing/extract", async (req, res) => {
    try {
      // This endpoint would normally process an uploaded bill document
      // and extract the bill amount using OCR or other techniques
      // For now, we'll simulate this with a dummy response
      
      // In a real implementation, you would:
      // 1. Save the uploaded file
      // 2. Process it with an OCR service or similar
      // 3. Extract the bill amount and other relevant information
      
      // Simulated processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Respond with a sample extracted bill amount
      // In a real implementation, this would come from the processed document
      res.json({
        billAmount: 5000, // Sample value in KSh
        periodStart: "2023-03-01",
        periodEnd: "2023-03-31"
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to process bill document"
      });
    }
  });

  // Register API router
  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
