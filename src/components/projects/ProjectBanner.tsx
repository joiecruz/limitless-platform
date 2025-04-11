
import { CreateProjectButton } from "./CreateProjectButton";

interface ProjectBannerProps {
  onCreateProject: () => void;
}

export function ProjectBanner({ onCreateProject }: ProjectBannerProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6 p-6">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Create more impactful projects using design thinking and AI
            </h2>
            <p className="text-muted-foreground mt-2">
              Design people-centered projects with the help of AI
            </p>
          </div>
          <CreateProjectButton onClick={onCreateProject} />
        </div>
        <div className="flex-shrink-0">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets//projects-banner.png" 
            alt="Project Design" 
            className="w-full max-w-md h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
