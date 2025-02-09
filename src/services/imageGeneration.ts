
import { RunwareService, GenerateImageParams } from "@/lib/runware";

const RUNWARE_API_KEY = import.meta.env.VITE_RUNWARE_API_KEY;

export async function generateProjectCoverImage(projectName: string, projectDescription: string): Promise<string | null> {
  try {
    const runware = new RunwareService(RUNWARE_API_KEY);
    
    const prompt = `Create a minimalist vector illustration for a project named "${projectName}" with the following description: "${projectDescription}". Make it abstract, modern, and professional, using soft colors and simple shapes.`;
    
    const params: GenerateImageParams = {
      positivePrompt: prompt,
      model: "runware:100@1",
      numberResults: 1,
      outputFormat: "WEBP",
      CFGScale: 1,
      scheduler: "FlowMatchEulerDiscreteScheduler"
    };

    const result = await runware.generateImage(params);
    return result.imageURL;
  } catch (error) {
    console.error('Error generating project cover image:', error);
    return null;
  }
}
