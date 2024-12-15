import { Button } from "@/components/ui/button";
import { OnboardingData } from "../types";

interface Step3Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  data: OnboardingData;
  loading?: boolean;
  isInvitedUser?: boolean;
  workspaceName?: string;
}

export function Step3({ onNext, onBack, data, loading, isInvitedUser, workspaceName }: Step3Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext({
      referralSource: data.referralSource,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold leading-tight">One last thing...</h2>
        <p className="text-muted-foreground">
          {isInvitedUser 
            ? `You're about to join ${workspaceName}. Help us understand how you found us.`
            : "Help us understand how you found us"}
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700">How did you hear about us?</label>
        <select
          id="referralSource"
          name="referralSource"
          value={data.referralSource}
          onChange={(e) => onNext({ referralSource: e.target.value })}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
        >
          <option value="">Select an option</option>
          <option value="friend">Friend</option>
          <option value="social_media">Social Media</option>
          <option value="search_engine">Search Engine</option>
          <option value="advertisement">Advertisement</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={loading}>
          {isInvitedUser ? "Join Workspace" : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
}
