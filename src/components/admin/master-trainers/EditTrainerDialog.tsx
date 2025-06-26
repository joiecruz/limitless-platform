
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  bio: z.string().optional(),
  profile_image_url: z.string().url().optional().or(z.literal("")),
  is_active: z.boolean(),
});

interface TrainerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  expertise_areas: string[] | null;
  profile_image_url: string | null;
  is_active: boolean;
}

interface EditTrainerDialogProps {
  trainer: TrainerProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditTrainerDialog({ trainer, open, onOpenChange, onSuccess }: EditTrainerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [expertiseAreas, setExpertiseAreas] = useState<string[]>([]);
  const [newExpertise, setNewExpertise] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: trainer.first_name,
      last_name: trainer.last_name,
      email: trainer.email,
      bio: trainer.bio || "",
      profile_image_url: trainer.profile_image_url || "",
      is_active: trainer.is_active,
    },
  });

  useEffect(() => {
    if (trainer.expertise_areas) {
      setExpertiseAreas(trainer.expertise_areas);
    }
  }, [trainer.expertise_areas]);

  const addExpertiseArea = () => {
    if (newExpertise.trim() && !expertiseAreas.includes(newExpertise.trim())) {
      setExpertiseAreas([...expertiseAreas, newExpertise.trim()]);
      setNewExpertise("");
    }
  };

  const removeExpertiseArea = (area: string) => {
    setExpertiseAreas(expertiseAreas.filter(a => a !== area));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('master_trainer_profiles')
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          bio: values.bio || null,
          expertise_areas: expertiseAreas.length > 0 ? expertiseAreas : null,
          profile_image_url: values.profile_image_url || null,
          is_active: values.is_active,
        })
        .eq('id', trainer.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trainer profile updated successfully.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update trainer profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Master Trainer</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profile_image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input type="url" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Expertise Areas</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  placeholder="Add expertise area"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertiseArea())}
                />
                <Button type="button" onClick={addExpertiseArea} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {expertiseAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="flex items-center gap-1">
                    {area}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeExpertiseArea(area)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Whether this trainer profile is active
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Trainer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
