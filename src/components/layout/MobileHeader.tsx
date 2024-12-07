import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onOpenSidebar: () => void;
}

export function MobileHeader({ onOpenSidebar }: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
      <button
        type="button"
        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
        onClick={onOpenSidebar}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex flex-1 items-center justify-between px-4">
        <span className="text-xl font-semibold text-primary-600">Limitless Lab</span>
      </div>
    </div>
  );
}