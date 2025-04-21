import { pgTable, text, serial, integer, boolean, doublePrecision, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
}));

// Appliances table
export const appliances = pgTable("appliances", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // residential, commercial, industrial
  power: integer("power").notNull(), // in watts
  hourlyUsage: doublePrecision("hourly_usage").notNull(), // average hours used per day
  iconName: text("icon_name"), // lucide icon name
  description: text("description"),
});

export const insertApplianceSchema = createInsertSchema(appliances).omit({
  id: true,
});

export type InsertAppliance = z.infer<typeof insertApplianceSchema>;
export type Appliance = typeof appliances.$inferSelect;

// Counties table (Kenya has 47 counties)
export const counties = pgTable("counties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  irradiance: doublePrecision("irradiance").notNull(), // average annual solar irradiance in kWh/m²/day
  peakSunHours: doublePrecision("peak_sun_hours").notNull(), // average peak sun hours per day
});

export const insertCountySchema = createInsertSchema(counties).omit({
  id: true,
});

export type InsertCounty = z.infer<typeof insertCountySchema>;
export type County = typeof counties.$inferSelect;

// County relations
export const countiesRelations = relations(counties, ({ many }) => ({
  projects: many(projects),
}));

// Installers table
export const installers = pgTable("installers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  address: text("address"),
  countyIds: integer("county_ids").array(), // counties they operate in
  verified: boolean("verified").default(false),
  rating: doublePrecision("rating"), // average rating (1-5)
  services: text("services").array(), // services offered
});

export const insertInstallerSchema = createInsertSchema(installers).omit({
  id: true,
  verified: true,
  rating: true,
});

export type InsertInstaller = z.infer<typeof insertInstallerSchema>;
export type Installer = typeof installers.$inferSelect;

// Projects table (saved calculations)
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  countyId: integer("county_id").notNull().references(() => counties.id),
  dailyUsage: doublePrecision("daily_usage").notNull(), // in kWh
  monthlyUsage: doublePrecision("monthly_usage").notNull(), // in kWh
  systemSize: doublePrecision("system_size").notNull(), // in kWp
  estimatedCost: doublePrecision("estimated_cost").notNull(), // in KSh
  monthlySavings: doublePrecision("monthly_savings").notNull(), // in KSh
  paybackPeriod: doublePrecision("payback_period").notNull(), // in years
  appliances: jsonb("appliances"), // selected appliances with usage
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

// Project relations
export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  county: one(counties, {
    fields: [projects.countyId],
    references: [counties.id],
  }),
}));

// Zod schema for energy calculation request
export const energyCalculationSchema = z.object({
  appliances: z.array(
    z.object({
      id: z.number(),
      quantity: z.number().min(1),
      hoursPerDay: z.number().min(0).max(24),
    })
  ).optional(),
  billAmount: z.number().optional(), // if using bill upload method
  countyId: z.number(),
});

export type EnergyCalculation = z.infer<typeof energyCalculationSchema>;

// Zod schema for system sizing request
export const systemSizingSchema = z.object({
  dailyUsage: z.number().positive(),
  countyId: z.number(),
  roofArea: z.number().optional(), // in square meters, optional
  includeStorage: z.boolean().default(false),
});

export type SystemSizing = z.infer<typeof systemSizingSchema>;

// Zod schema for ROI calculation request
export const roiCalculationSchema = z.object({
  systemSize: z.number().positive(),
  systemCost: z.number().positive(),
  dailyUsage: z.number().positive(),
  electricityRate: z.number().positive(),
  countyId: z.number(),
  annualIncrease: z.number().default(5), // % increase in electricity costs per year
});

export type ROICalculation = z.infer<typeof roiCalculationSchema>;
