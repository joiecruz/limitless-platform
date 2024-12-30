import { Logo } from "./types/logo";
import { LogoItem } from "./LogoItem";

interface LogoListProps {
  logos: Logo[];
}

export function LogoList({ logos }: LogoListProps) {
  return (
    <div className="flex items-center">
      {logos.map((logo) => (
        <LogoItem key={logo.id} logo={logo} />
      ))}
    </div>
  );
}