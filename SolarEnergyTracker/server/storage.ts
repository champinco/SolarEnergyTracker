import {
  users, type User, type InsertUser,
  appliances, type Appliance, type InsertAppliance,
  counties, type County, type InsertCounty,
  installers, type Installer, type InsertInstaller,
  projects, type Project, type InsertProject
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Storage interface for all CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appliance operations
  getAppliances(): Promise<Appliance[]>;
  getAppliancesByCategory(category: string): Promise<Appliance[]>;
  getAppliance(id: number): Promise<Appliance | undefined>;
  createAppliance(appliance: InsertAppliance): Promise<Appliance>;
  
  // County operations
  getCounties(): Promise<County[]>;
  getCounty(id: number): Promise<County | undefined>;
  createCounty(county: InsertCounty): Promise<County>;
  
  // Installer operations
  getInstallers(): Promise<Installer[]>;
  getInstallersByCounty(countyId: number): Promise<Installer[]>;
  getInstaller(id: number): Promise<Installer | undefined>;
  createInstaller(installer: InsertInstaller): Promise<Installer>;
  
  // Project operations
  getProjects(userId?: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
}

// DatabaseStorage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAppliances(): Promise<Appliance[]> {
    return db.select().from(appliances).orderBy(appliances.category, appliances.name);
  }
  
  async getAppliancesByCategory(category: string): Promise<Appliance[]> {
    return db.select().from(appliances).where(eq(appliances.category, category)).orderBy(appliances.name);
  }
  
  async getAppliance(id: number): Promise<Appliance | undefined> {
    const [appliance] = await db.select().from(appliances).where(eq(appliances.id, id));
    return appliance;
  }
  
  async createAppliance(insertAppliance: InsertAppliance): Promise<Appliance> {
    const [appliance] = await db.insert(appliances).values(insertAppliance).returning();
    return appliance;
  }
  
  async getCounties(): Promise<County[]> {
    return db.select().from(counties).orderBy(counties.name);
  }
  
  async getCounty(id: number): Promise<County | undefined> {
    const [county] = await db.select().from(counties).where(eq(counties.id, id));
    return county;
  }
  
  async createCounty(insertCounty: InsertCounty): Promise<County> {
    const [county] = await db.insert(counties).values(insertCounty).returning();
    return county;
  }
  
  async getInstallers(): Promise<Installer[]> {
    return db.select().from(installers).orderBy(desc(installers.verified), installers.name);
  }
  
  async getInstallersByCounty(countyId: number): Promise<Installer[]> {
    // Filter installers that operate in the given county
    const allInstallers = await db.select().from(installers).orderBy(desc(installers.verified), installers.name);
    
    // Since countyIds is an array, we need to filter after selection
    return allInstallers.filter(installer => 
      installer.countyIds && installer.countyIds.includes(countyId)
    );
  }
  
  async getInstaller(id: number): Promise<Installer | undefined> {
    const [installer] = await db.select().from(installers).where(eq(installers.id, id));
    return installer;
  }
  
  async createInstaller(insertInstaller: InsertInstaller): Promise<Installer> {
    const [installer] = await db.insert(installers).values(insertInstaller).returning();
    return installer;
  }
  
  async getProjects(userId?: number): Promise<Project[]> {
    if (userId) {
      return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
    }
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  
  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values({
      ...insertProject,
      createdAt: new Date()
    }).returning();
    return project;
  }
}

// Use database storage for the application
export const storage = new DatabaseStorage();