import { Button } from "@/components/ui/button";

interface ToolDownloadCTAProps {
  onDownload: () => void;
}

export function ToolDownloadCTA({ onDownload }: ToolDownloadCTAProps) {
  return (
    <div className="bg-[#393CA0] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Download your <span className="text-[#66E6F5]">template</span>
        </h2>
        <p className="text-white/80 mb-8">Get started with this template right now!</p>
        <Button 
          onClick={onDownload}
          size="lg"
          className="bg-white text-[#393CA0] hover:bg-gray-100 px-8 py-6 text-lg"
        >
          Get template
        </Button>
      </div>
    </div>
  );
}