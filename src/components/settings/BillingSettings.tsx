import { Button } from "@/components/ui/button";

export function BillingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Manage your billing information and subscription.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-md border p-4">
          <p className="text-sm text-muted-foreground">
            You are currently on the free plan.
          </p>
        </div>
        
        <Button disabled className="opacity-50 cursor-not-allowed">
          Upgrade Plan
        </Button>
      </div>
    </div>
  );
}