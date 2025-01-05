import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function UseCaseFields({ form }: { form: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="use_case_1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Use Case 1</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="use_case_2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Use Case 2</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="use_case_3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Use Case 3</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}