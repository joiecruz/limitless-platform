
import { Plus } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

interface CreateProjectButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

const CreateProjectButton = forwardRef<HTMLButtonElement, CreateProjectButtonProps>(
  ({ children = "Create new project", ...props }, ref) => {
    return (
      <Button 
        ref={ref}
        className="gap-2 bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white" 
        {...props}
      >
        <Plus className="h-5 w-5" />
        {children}
      </Button>
    );
  }
);
CreateProjectButton.displayName = "CreateProjectButton";

export { CreateProjectButton };
