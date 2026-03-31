"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export interface ProgressStep {
  id: string;
  label: string;
  detail: string;
  durationMs: number; // approx time this step takes
}

interface StepProgressLoaderProps {
  steps: ProgressStep[];
  isComplete: boolean;
}

export default function StepProgressLoader({ steps, isComplete }: StepProgressLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let stepIndex = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const advance = () => {
      if (stepIndex >= steps.length - 1) return;
      const delay = steps[stepIndex].durationMs;
      const t = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex++;
        setCurrentStep(stepIndex);
        advance();
      }, delay);
      timers.push(t);
    };

    advance();
    return () => timers.forEach(clearTimeout);
  }, [steps]);

  // When API completes, mark all steps done
  useEffect(() => {
    if (isComplete) {
      setCompletedSteps(steps.map((_, i) => i));
      setCurrentStep(steps.length);
    }
  }, [isComplete, steps]);

  return (
    <div className="py-8 px-2 max-w-md mx-auto">
      <div className="space-y-0">
        {steps.map((step, i) => {
          const done = completedSteps.includes(i);
          const active = currentStep === i && !isComplete;
          const pending = !done && !active;

          return (
            <div key={step.id} className="flex gap-4 group">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 border ${
                    done
                      ? "bg-success/20 border-success/40"
                      : active
                      ? "bg-accent/20 border-accent/50"
                      : "bg-elevated border-[rgba(255,255,255,0.08)]"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={14} className="text-success" />
                  ) : active ? (
                    <Loader2 size={14} className="text-accent-light animate-spin" />
                  ) : (
                    <span className="text-[10px] font-sora font-bold text-muted">
                      {i + 1}
                    </span>
                  )}
                </div>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div
                    className={`w-px flex-1 my-1 transition-all duration-700 ${
                      done ? "bg-success/30" : "bg-[rgba(255,255,255,0.06)]"
                    }`}
                    style={{ minHeight: "24px" }}
                  />
                )}
              </div>

              {/* Content column */}
              <div className={`pb-6 flex-1 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                <p
                  className={`text-sm font-sora font-semibold transition-colors duration-300 ${
                    done
                      ? "text-success"
                      : active
                      ? "text-primary"
                      : "text-muted"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-xs font-dm mt-0.5 transition-colors duration-300 ${
                    active ? "text-secondary" : "text-muted"
                  }`}
                >
                  {step.detail}
                </p>

                {/* Active shimmer bar */}
                {active && (
                  <div className="mt-2 h-1 rounded-full bg-elevated overflow-hidden w-32">
                    <div className="h-full shimmer rounded-full" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom status */}
      <div className="mt-4 text-center">
        <p className="text-xs text-secondary font-dm animate-pulse">
          {isComplete ? "Done! Rendering results..." : "This usually takes 30–50 seconds"}
        </p>
      </div>
    </div>
  );
}
