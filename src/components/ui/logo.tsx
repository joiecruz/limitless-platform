import React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h1 className="text-2xl font-bold">Your Logo</h1>
    </div>
  );
}