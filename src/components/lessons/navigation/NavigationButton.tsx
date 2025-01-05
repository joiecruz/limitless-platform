import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonProps {
  direction: "previous" | "next";
  onClick: () => void;
}

export const NavigationButton = ({ direction, onClick }: NavigationButtonProps) => {
  const isNext = direction === "next";
  const Icon = isNext ? ArrowRight : ArrowLeft;
  
  return (
    <Button
      variant="ghost"
      onClick={onClick}
    >
      {!isNext && <Icon className="w-4 h-4 mr-2" />}
      {isNext ? "Next" : "Previous"} Lesson
      {isNext && <Icon className="w-4 h-4 ml-2" />}
    </Button>
  );
};