import { Briefcase, BookOpen, Download, Users } from "lucide-react";

const modules = [
  {
    title: "Projects",
    description: "Manage your innovation projects and track their progress",
    icon: Briefcase,
    count: 12,
    href: "/dashboard/projects",
  },
  {
    title: "Courses",
    description: "Access learning materials and track your progress",
    icon: BookOpen,
    count: 5,
    href: "/dashboard/courses",
  },
  {
    title: "Tools",
    description: "Download resources, worksheets, and innovation toolkits",
    icon: Download,
    count: 24,
    href: "/dashboard/tools",
  },
  {
    title: "Community",
    description: "Connect with other innovators in real-time",
    icon: Users,
    count: 156,
    href: "/dashboard/community",
  },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's an overview of your innovation journey
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <a key={module.title} href={module.href} className="module-card">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary-50 p-2">
                <module.icon className="h-5 w-5 text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{module.count}</span>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">{module.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{module.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}