/**
 * Dev-only Supabase response size logger.
 *
 * In development, wrap a Supabase query thenable to log table name and
 * approximate JSON payload size to the console. No-op in production.
 *
 * Usage:
 *   import { logSize } from "@/lib/egressLogger";
 *   const { data } = await logSize(
 *     "articles",
 *     supabase.from("articles").select("id, title").limit(20)
 *   );
 *
 * Use this temporarily to find the heaviest queries — do not leave it
 * sprinkled throughout production code.
 */
type SupabasePromise<T> = PromiseLike<{ data: T; error: unknown }>;

export async function logSize<T>(
  label: string,
  promise: SupabasePromise<T>
): Promise<{ data: T; error: unknown }> {
  if (!import.meta.env.DEV) {
    return promise as Promise<{ data: T; error: unknown }>;
  }
  const result = await promise;
  try {
    const bytes = JSON.stringify(result.data ?? null).length;
    const kb = (bytes / 1024).toFixed(1);
    // eslint-disable-next-line no-console
    console.debug(`[egress] ${label}: ~${kb} KB`);
  } catch {
    /* ignore stringify errors */
  }
  return result;
}
