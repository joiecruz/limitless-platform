import { Logo } from "./types/logo";
import { LogoItem } from "./LogoItem";

interface LogoListProps {
  logos: Logo[];
}

export function LogoList({ logos }: LogoListProps) {
  return (
    <div className="flex items-center w-full">
      {logos.map((logo, index) => (
        <LogoItem key={`${logo.id}-${index}`} logo={logo} />
      ))}
    </div>
  );
}