import { Logo } from "./types/logo";

interface LogoItemProps {
  logo: Logo;
}

export function LogoItem({ logo }: LogoItemProps) {
  return (
    <div className="mx-4 flex items-center justify-center">
      <img
        src={logo.image_url}
        alt={logo.name}
        className="h-12 w-auto object-contain"
        loading="lazy"
      />
    </div>
  );
}