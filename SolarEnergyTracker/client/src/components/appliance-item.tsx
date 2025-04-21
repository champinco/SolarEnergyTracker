import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApplianceItemProps {
  id: number;
  name: string;
  power: number;
  hourlyUsage: number;
  iconName?: string;
  description?: string;
  onSelect: (
    id: number,
    quantity: number,
    hoursPerDay: number,
    dailyUsage: number
  ) => void;
  isSelected?: boolean;
  initialQuantity?: number;
  initialHours?: number;
}

export function ApplianceItem({
  id,
  name,
  power,
  hourlyUsage,
  iconName = "zap",
  description,
  onSelect,
  isSelected = false,
  initialQuantity = 0,
  initialHours = 0,
}: ApplianceItemProps) {
  const [quantity, setQuantity] = useState(initialQuantity || 0);
  const [hoursPerDay, setHoursPerDay] = useState(initialHours || hourlyUsage);

  const dailyUsageWh = quantity * power * hoursPerDay;
  const dailyUsageKwh = dailyUsageWh / 1000;

  // Handler for when quantity or hours changes
  const handleChange = (newQuantity: number, newHours: number) => {
    setQuantity(newQuantity);
    setHoursPerDay(newHours);
    onSelect(id, newQuantity, newHours, (newQuantity * power * newHours) / 1000);
  };

  // Dynamically get icon component by name
  const IconComponent = (Icons as any)[
    iconName.charAt(0).toUpperCase() + iconName.slice(1)
  ] || Icons.Zap;

  return (
    <Card
      className={cn(
        "relative p-4 transition-all",
        isSelected
          ? "border-primary-light shadow-md"
          : "hover:shadow-card-hover"
      )}
    >
      <div className="flex items-start mb-3">
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-medium text-neutral-800">{name}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <InfoIcon className="h-4 w-4 text-neutral-500" />
                    <span className="sr-only">Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px]">
                  <p className="text-sm">{description || `${power}W appliance that typically runs for ${hourlyUsage} hours per day.`}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-neutral-600">{power}W</p>
        </div>
      </div>

      {quantity > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor={`quantity-${id}`} className="text-sm text-neutral-600">
              Quantity
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => {
                  const newQuantity = Math.max(0, quantity - 1);
                  handleChange(newQuantity, hoursPerDay);
                }}
              >
                <Icons.Minus className="h-3 w-3" />
              </Button>
              <Input
                id={`quantity-${id}`}
                type="number"
                min="0"
                className="w-14 h-8 text-center"
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 0;
                  handleChange(newQuantity, hoursPerDay);
                }}
              />
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => {
                  handleChange(quantity + 1, hoursPerDay);
                }}
              >
                <Icons.Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <Label htmlFor={`hours-${id}`} className="text-sm text-neutral-600">
                Hours per day: {hoursPerDay}
              </Label>
            </div>
            <Slider
              id={`hours-${id}`}
              min={0}
              max={24}
              step={0.5}
              value={[hoursPerDay]}
              onValueChange={(value) => {
                handleChange(quantity, value[0]);
              }}
            />
          </div>

          <div className="bg-neutral-50 p-2 rounded">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-600">Daily usage:</span>
              <span className="font-medium text-primary">
                {dailyUsageKwh.toFixed(2)} kWh
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={() => handleChange(1, hoursPerDay)}
        >
          Add
        </Button>
      )}
    </Card>
  );
}
