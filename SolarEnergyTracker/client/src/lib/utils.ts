import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "KSh"): string {
  return `${currency} ${value.toLocaleString()}`;
}

export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function calculateBill(kwh: number): number {
  // Kenya Power tariff (approximate)
  const rate = 25; // KSh per kWh including taxes and fees
  return kwh * rate;
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

export function convertKwhToCo2(kwh: number): number {
  // Kenya's grid emissions factor (approximate)
  const emissionsFactor = 0.5; // kg CO2 per kWh
  return kwh * emissionsFactor;
}

export function getArrayRange(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// Helper function to create a full URL
export function createApiUrl(endpoint: string): string {
  return `/api${endpoint}`;
}

// Helper for validating file types
export function isValidFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.includes(file.type);
}

// Helper for file size checking
export function isValidFileSize(file: File, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

// Helper for extracting error message
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
