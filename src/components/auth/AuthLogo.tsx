import React from 'react';

interface AuthLogoProps {
  onClick?: () => void;
}

export const AuthLogo = ({ onClick }: AuthLogoProps) => {
  return (
    <div className="text-center mb-8" onClick={onClick}>
      <img 
        src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
        alt="Limitless Lab"
        className="h-12 w-auto mx-auto mb-6 cursor-pointer"
      />
    </div>
  );
};