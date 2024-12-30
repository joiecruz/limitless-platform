import { LogoPlaceholder } from "./LogoPlaceholder";

interface ScrollingPlaceholdersProps {
  count?: number;
}

export function ScrollingPlaceholders({ count = 10 }: ScrollingPlaceholdersProps) {
  return (
    <div className="flex items-center">
      {Array.from({ length: count }).map((_, index) => (
        <LogoPlaceholder key={index} />
      ))}
    </div>
  );
}