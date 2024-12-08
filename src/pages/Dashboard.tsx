import { Card } from "@/components/ui/card";
import { BookOpen, Users, FolderKanban, Download } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Here's an overview of your innovation journey
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <FolderKanban className="h-5 w-5 text-indigo-600" />
            <span className="text-2xl font-bold">12</span>
          </div>
          <h3 className="font-semibold">Projects</h3>
          <p className="text-sm text-muted-foreground">
            Manage your innovation projects and track their progress
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span className="text-2xl font-bold">5</span>
          </div>
          <h3 className="font-semibold">Courses</h3>
          <p className="text-sm text-muted-foreground">
            Access learning materials and track your progress
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <Download className="h-5 w-5 text-indigo-600" />
            <span className="text-2xl font-bold">24</span>
          </div>
          <h3 className="font-semibold">Tools</h3>
          <p className="text-sm text-muted-foreground">
            Download resources, worksheets, and innovation toolkits
          </p>
        </Card>

        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <Users className="h-5 w-5 text-indigo-600" />
            <span className="text-2xl font-bold">156</span>
          </div>
          <h3 className="font-semibold">Community</h3>
          <p className="text-sm text-muted-foreground">
            Connect with other innovators in real-time
          </p>
        </Card>
      </div>
    </div>
  );
}