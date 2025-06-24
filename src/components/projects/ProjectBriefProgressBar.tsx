import React from "react";

export default function ProjectBriefProgressBar({ currentStep = 0 }: { currentStep?: number }) {
  // Step data for easier mapping
  const steps = [
    { number: "01", label: "Overview" },
    { number: "02", label: "Success Criteria" },
    { number: "03", label: "Timeline & Team" },
  ];

  // Circle rendering
  function renderCircle(idx: number) {
    if (idx === currentStep) {
      return (
        <span style={{
          width: 16,
          height: 16,
          background: '#FFF',
          borderRadius: 8,
          borderWidth: 5,
          borderColor: '#393CA0',
          borderStyle: 'solid',
          zIndex: 2,
          display: 'inline-block',
        }} />
      );
    } else if (idx <= currentStep) {
      // Current: filled colored circle
      return (
        <span style={{
          width: 16,
          height: 16,
          background: '#393CA0',
          borderRadius: 8,
          borderWidth: 5,
          borderColor: '#393CA0',
          borderStyle: 'solid',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 12,
        }}></span>
      );
    } else {
      // Incomplete: gray circle
      return (
        <span style={{
          width: 16,
          height: 16,
          background: '#FFF',
          borderRadius: 8,
          borderWidth: 4,
          borderColor: '#E5E7EB',
          borderStyle: 'solid',
          zIndex: 2,
          display: 'inline-block',
        }} />
      );
    }
  }

  // Line style
  const lineStyle = (active: boolean) => ({
    display: 'inline-block',
    height: 4,
    width: 184,
    background: active ? '#393CA0' : '#E5E7EB',
    verticalAlign: 'middle',
    borderRadius: 2,
    marginLeft: -1,
    marginRight: 0,
  });

  return (
    <div className="w-full" style={{ maxWidth: 600 }}>
      {/* Step Labels */}
      <div className="grid grid-cols-3 gap-0 w-full pl-4 font-sans text-[16px]">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-start">
            <span className="text-[16px]" style={{ color: '#323743FF' }}>
              <span className="font-extrabold">{step.number}</span> <span className="font-normal">{step.label}</span>
            </span>
          </div>
        ))}
      </div>
      {/* Circles and Lines */}
      <div className="relative w-full mt-2 pl-4" style={{ height: 24 }}>
        <div className="grid grid-cols-3 gap-0 w-full" style={{ position: 'relative' }}>
          {steps.map((step, idx) => (
            <div key={step.number} className="flex flex-col items-start relative">
              {renderCircle(idx)}
              {/* Line to next circle (except last) */}
              {idx < steps.length - 1 && (
                <span
                  style={{
                    ...lineStyle(idx < currentStep || idx === currentStep),
                    position: 'absolute',
                    left: 16,
                    top: 6,
                  }}
                />
              )}
            </div>
          ))}
          {/* Last gray line and extra completed circle at the same height */}
          <div className="flex flex-row items-center relative" style={{ position: 'absolute', left: '68%', top: -4 }}>
            <span style={lineStyle(false)} />
            <span style={{ marginLeft: 0 }}>
              {currentStep < steps.length ? (
                <span style={{
                  width: 16,
                  height: 16,
                  background: '#E5E7EB',
                  borderRadius: 8,
                  borderWidth: 5,
                  borderColor: '#E5E7EB',
                  borderStyle: 'solid',
                  zIndex: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9CA3AF',
                  fontWeight: 700,
                  fontSize: 12,
                  position: 'relative',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: 'block' }}>
                    <polyline points="2,5.5 4,7.5 8,3.5" fill="none" stroke="#FFFFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              ) : (
                <span style={{
                  width: 16,
                  height: 16,
                  background: '#393CA0',
                  borderRadius: 8,
                  borderWidth: 5,
                  borderColor: '#393CA0',
                  borderStyle: 'solid',
                  zIndex: 2,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  position: 'relative',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" style={{ display: 'block' }}>
                    <polyline points="2,5.5 4,7.5 8,3.5" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 