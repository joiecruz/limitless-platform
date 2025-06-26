
interface DashboardHeaderProps {
  displayName: string;
}

export function DashboardHeader({ displayName }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome{displayName ? `, ${displayName}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your innovation journey
        </p>
      </div>
    </div>
  );
}
