import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStepNavigation } from "@/components/projects/ProjectNavBar";

export default function ProjectLoading() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  let changeStep: ((step: string) => void) | undefined;
  try {
    changeStep = useStepNavigation().changeStep;
  } catch {
    changeStep = undefined;
  }

  useEffect(() => {
    if (projectId && changeStep) {
      changeStep("Empathize");
      return;
    }
    const timer = setTimeout(() => {
      navigate("/dashboard/projects");
    }, 1000);
    return () => clearTimeout(timer);
  }, [projectId, changeStep, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      {/* Loading Spinner */}
      <div className="relative w-12 h-12 mb-6">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
            style={{
              background: '#393CA0',
              transform: `rotate(${i * 30}deg) translate(0, -20px)`,
              animation: `loading-fade 1.2s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <div className="text-[25px] text-[#23255A] font-medium text-center leading-snug">
        Saving your<br />project...
      </div>
      <style>{`
        @keyframes loading-fade {
          0%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
          60% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
