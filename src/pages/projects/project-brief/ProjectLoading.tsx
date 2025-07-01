import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectLoading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard/projects");
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

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
        We're setting up your<br />project workspace
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
