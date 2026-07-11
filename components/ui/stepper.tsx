"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export type StepperStep = {
  id: string;
  label: string;
  description?: string;
};

type StepperProps = {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
};

function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav aria-label="Progresso" className={cn("w-full", className)}>
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors",
                    isCompleted &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary bg-background text-primary ring-2 ring-primary/20",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-muted text-muted-foreground",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check className="size-4" aria-hidden />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="hidden w-full text-center sm:block">
                  <p
                    className={cn(
                      "truncate text-xs font-medium",
                      isCurrent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description ? (
                    <p className="text-muted-foreground truncate text-[0.65rem]">
                      {step.description}
                    </p>
                  ) : null}
                </div>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    "hidden h-px flex-1 sm:block",
                    isCompleted ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Stepper };
