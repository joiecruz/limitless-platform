import React from 'react';

interface AuthLogoProps {
  onClick?: () => void;
}

export const AuthLogo = ({ onClick }: AuthLogoProps) => {
  return (
    <div className="text-center mb-8" onClick={onClick}>
      <img
        src="/limitless-logo.svg"
        alt="Limitless Lab"
        className="h-12 w-auto mx-auto mb-6 cursor-pointer"
      />
    </div>
  );
};