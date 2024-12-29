import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#393CA0] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Start innovating for
          <span className="block text-[#66E6F5]">impact today</span>
        </h2>
        <Button 
          onClick={() => navigate("/signup")}
          size="lg"
          className="bg-white text-[#393CA0] hover:bg-gray-100 px-8"
        >
          Register for free
        </Button>
      </div>
    </div>
  );
}