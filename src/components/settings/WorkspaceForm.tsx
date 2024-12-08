import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface WorkspaceFormProps {
  defaultValues: {
    name: string;
  };
  onSubmit: (data: { name: string }) => Promise<void>;
  isLoading: boolean;
}

export function WorkspaceForm({ defaultValues, onSubmit, isLoading }: WorkspaceFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Workspace Name</Label>
        <Input 
          id="name"
          {...register("name", { required: "Workspace name is required" })}
          placeholder="Enter workspace name"
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={true}>
        Temporarily Disabled
      </Button>
    </form>
  );
}