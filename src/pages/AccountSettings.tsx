import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { DataExport } from "@/components/gdpr/DataExport";
import { AccountDeletion } from "@/components/gdpr/AccountDeletion";
import { PrivacyPolicy } from "@/components/gdpr/PrivacyPolicy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountSettings() {
  const [loading, setLoading] = useState(false);
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
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <div className="bg-white p-6 rounded-lg border">
            <ProfileForm
              loading={loading}
              profile={profile}
              userEmail={session?.email || ''}
              onSubmit={handleSubmit}
            />
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-8">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-6">Privacy & Data Settings</h2>
            
            <div className="space-y-8">
              <DataExport />
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Privacy Policy</h3>
                <PrivacyPolicy />
              </div>
              
              <Separator />
              
              <AccountDeletion />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}