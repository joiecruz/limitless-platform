
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ToolkitFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: any;
  isLoading?: boolean;
}

export function ToolkitForm({ onSubmit, defaultValues, isLoading }: ToolkitFormProps) {
  const form = useForm({
    defaultValues: defaultValues || {
      name: "",
      description: "",
      category: "Innovation Process and Tools",
      cover_image_url: "",
      about_this_tool: "",
      use_cases: "",
      how_to_use: "",
      when_to_use: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter toolkit name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter category" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter toolkit description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about_this_tool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About This Tool</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter detailed information about this toolkit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="use_cases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Use Cases</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the main use cases for this toolkit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="how_to_use"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How to Use</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Provide instructions on how to use this toolkit" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="when_to_use"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When to Use</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe when this toolkit should be used" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter cover image URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
