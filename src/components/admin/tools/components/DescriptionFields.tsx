import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function DescriptionFields({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name="brief_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Brief Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="long_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Long Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}