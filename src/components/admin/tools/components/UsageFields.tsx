import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function UsageFields({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name="how_to_use"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How to Use</FormLabel>
            <FormControl>
              <Textarea {...field} />
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
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}