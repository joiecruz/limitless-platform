import { Logo } from "./types/logo";

interface LogoItemProps {
  logo: Logo;
}

export function LogoItem({ logo }: LogoItemProps) {
  return (
    <div className="flex items-center justify-center w-32">
      <img
        src={logo.image_url}
        alt={logo.name}
        className="h-12 w-auto object-contain"
        loading="lazy"
      />
    </div>
  );
}