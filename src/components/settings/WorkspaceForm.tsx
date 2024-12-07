import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

interface WorkspaceFormProps {
  defaultValues: {
    name: string;
    slug: string;
  };
  onSubmit: (data: { name: string; slug: string }) => Promise<void>;
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
      
      <div className="space-y-2">
        <Label htmlFor="slug">Workspace URL</Label>
        <div className="flex items-center space-x-2">
          <Input 
            id="slug"
            {...register("slug", {
              required: "Workspace URL is required",
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: "Only lowercase letters, numbers, and hyphens are allowed"
              }
            })}
            placeholder="your-workspace"
            className="w-[180px]"
          />
          <span className="text-sm text-muted-foreground">.limitlesslab.io</span>
        </div>
        {errors.slug && (
          <p className="text-sm text-destructive">{errors.slug.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          This is your workspace's unique subdomain.
        </p>
      </div>
      
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}