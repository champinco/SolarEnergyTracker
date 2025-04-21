import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export type Step = {
  id: number;
  name: string;
};

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
  className?: string;
}

export function Stepper({ steps, currentStep, onChange, className }: StepperProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex justify-between items-center">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "stepper-item flex flex-col items-center",
              { completed: step.id < currentStep },
              { active: step.id === currentStep },
              "w-1/5"
            )}
          >
            <div
              onClick={() => {
                if (onChange && step.id <= currentStep) {
                  onChange(step.id);
                }
              }}
              className={cn(
                "stepper-number w-12 h-12 rounded-full flex items-center justify-center mb-2",
                step.id < currentStep
                  ? "bg-primary text-white"
                  : step.id === currentStep
                  ? "bg-primary text-white"
                  : "bg-neutral-300 text-neutral-700",
                { "cursor-pointer": onChange && step.id <= currentStep }
              )}
            >
              {step.id < currentStep ? (
                <Check className="h-6 w-6" />
              ) : (
                <span className="text-lg font-bold">{step.id}</span>
              )}
            </div>
            <span className="text-sm font-medium text-center">{step.name}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .stepper-item {
          position: relative;
        }
        .stepper-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 24px;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: #CCD6E0;
          z-index: 1;
        }
        .stepper-item.completed:not(:last-child)::after {
          background-color: #0066CC;
        }
        .stepper-number {
          z-index: 2;
          position: relative;
        }
      `}</style>
    </div>
  );
}
