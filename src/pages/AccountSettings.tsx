import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountSettings() {
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session?.id) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.id)
        .single();
    
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    
      return data;
    },
    enabled: !!session?.id
  });

  const handleSubmit = async (formData: { firstName: string; lastName: string }) => {
    setLoading(true);

    try {
      if (!session?.id) {
        throw new Error('No user found');
      }

      const updates = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', session.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      // Clear the password fields
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
        <div className="bg-white p-6 rounded-lg border">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      
      <div className="bg-white p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        <ProfileForm
          loading={loading}
          profile={profile}
          userEmail={session?.email || ''}
          onSubmit={handleSubmit}
        />
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Updating Password..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}