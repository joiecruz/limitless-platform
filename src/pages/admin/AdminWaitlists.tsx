import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Search, UsersRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 25;

type WaitlistSource = "ikigai" | "pafjo";

type IkigaiEntry = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  email: string;
  company_name: string | null;
  employee_count: string | null;
  industry: string | null;
  referral_source: string | null;
  system_to_build: string;
  created_at: string;
};

type PafjoEntry = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  company: string | null;
  team_size: string | null;
  industry: string | null;
  referral_source: string | null;
  created_at: string;
};

function useWaitlist(source: WaitlistSource, search: string, page: number) {
  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  return useQuery({
    queryKey: ["admin-waitlist", source, debouncedSearch, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      if (source === "ikigai") {
        let query = supabase
          .from("ikigai_waitlist")
          .select(
            "id, first_name, last_name, full_name, email, company_name, employee_count, industry, referral_source, system_to_build, created_at",
            { count: "exact" }
          )
          .order("created_at", { ascending: false })
          .range(from, to);

        if (debouncedSearch) {
          const term = `%${debouncedSearch}%`;
          query = query.or(
            `full_name.ilike.${term},email.ilike.${term},company_name.ilike.${term},industry.ilike.${term}`
          );
        }

        const result = await query;
        if (result.error) throw result.error;
        return {
          rows: (result.data ?? []) as IkigaiEntry[],
          total: result.count ?? 0,
        };
      }

      let query = supabase
        .from("pafjo_slide_leads")
        .select(
          "id, first_name, last_name, email, company, team_size, industry, referral_source, created_at",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        query = query.or(
          `first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term},company.ilike.${term},industry.ilike.${term}`
        );
      }

      const result = await query;
      if (result.error) throw result.error;
      return {
        rows: (result.data ?? []) as PafjoEntry[],
        total: result.count ?? 0,
      };
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}

function WaitlistPanel({ source, search, page, onPageChange }: { source: WaitlistSource; search: string; page: number; onPageChange: (page: number) => void }) {
  const { data, isLoading, isFetching, error } = useWaitlist(source, search, page);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border bg-card">
        {isLoading ? (
          <div className="flex h-72 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex h-72 items-center justify-center px-6 text-center text-destructive">
            Unable to load waitlist entries.
          </div>
        ) : (data?.rows.length ?? 0) === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center px-6 text-center">
            <UsersRound className="h-9 w-9 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-medium">No waitlist entries found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              New {source === "ikigai" ? "IKIGAI" : "PAFJO slides"} sign-ups will appear here.
            </p>
          </div>
        ) : source === "ikigai" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Team / Industry</TableHead>
                <TableHead className="min-w-72">System to build</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={isFetching ? "opacity-60" : undefined}>
              {(data?.rows as IkigaiEntry[]).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">{entry.full_name}</p>
                    <a href={`mailto:${entry.email}`} className="text-sm text-primary hover:underline">
                      {entry.email}
                    </a>
                  </TableCell>
                  <TableCell>{entry.company_name || "—"}</TableCell>
                  <TableCell>
                    <p>{entry.employee_count || "—"}</p>
                    <p className="text-sm text-muted-foreground">{entry.industry || "—"}</p>
                  </TableCell>
                  <TableCell className="max-w-md whitespace-normal leading-6">{entry.system_to_build}</TableCell>
                  <TableCell>{entry.referral_source || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(entry.created_at))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Person</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Team / Industry</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={isFetching ? "opacity-60" : undefined}>
              {(data?.rows as PafjoEntry[]).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {entry.first_name || entry.last_name
                        ? `${entry.first_name ?? ""} ${entry.last_name ?? ""}`.trim()
                        : "—"}
                    </p>
                    <a href={`mailto:${entry.email}`} className="text-sm text-primary hover:underline">
                      {entry.email}
                    </a>
                  </TableCell>
                  <TableCell>{entry.company || "—"}</TableCell>
                  <TableCell>
                    <p>{entry.team_size || "—"}</p>
                    <p className="text-sm text-muted-foreground">{entry.industry || "—"}</p>
                  </TableCell>
                  <TableCell>{entry.referral_source || "—"}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Intl.DateTimeFormat("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" }).format(new Date(entry.created_at))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page + 1} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous page"
            disabled={page === 0 || isFetching}
            onClick={() => onPageChange(Math.max(0, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next page"
            disabled={page + 1 >= totalPages || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminWaitlists() {
  const [activeTab, setActiveTab] = useState<WaitlistSource>("ikigai");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const switchTab = (value: WaitlistSource) => {
    setActiveTab(value);
    setPage(0);
    setSearch("");
  };

  const { data: countData } = useWaitlist(activeTab, search, page);
  const total = countData?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Waitlists</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage IKIGAI bootcamp and PAFJO slides leads
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UsersRound className="h-4 w-4" aria-hidden="true" />
          <span>{total.toLocaleString()} {total === 1 ? "entry" : "entries"}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => switchTab(value as WaitlistSource)}>
        <TabsList>
          <TabsTrigger value="ikigai">IKIGAI Bootcamp</TabsTrigger>
          <TabsTrigger value="pafjo">PAFJO Slides</TabsTrigger>
        </TabsList>

        <TabsContent value="ikigai" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(0); }}
              placeholder="Search name, email, company, or industry"
              aria-label="Search IKIGAI waitlist entries"
              className="pl-9"
            />
          </div>
          <WaitlistPanel source="ikigai" search={search} page={page} onPageChange={setPage} />
        </TabsContent>

        <TabsContent value="pafjo" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(0); }}
              placeholder="Search name, email, company, or industry"
              aria-label="Search PAFJO slide leads"
              className="pl-9"
            />
          </div>
          <WaitlistPanel source="pafjo" search={search} page={page} onPageChange={setPage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
