
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TrainerCard } from "./TrainerCard";
import { AddTrainerDialog } from "./AddTrainerDialog";

interface TrainerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  expertise_areas: string[] | null;
  contact_info: any;
  profile_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export function TrainersDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: trainers = [], isLoading, refetch } = useQuery({
    queryKey: ['master-trainer-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_trainer_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrainerProfile[];
    }
  });

  const filteredTrainers = trainers.filter(trainer =>
    `${trainer.first_name} ${trainer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trainer.expertise_areas && trainer.expertise_areas.some(area => 
      area.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Master Trainers Directory</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage profiles of certified master trainers
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Trainer
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trainers by name, email, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainers.map((trainer) => (
              <TrainerCard 
                key={trainer.id} 
                trainer={trainer} 
                onUpdate={() => refetch()}
              />
            ))}
          </div>

          {filteredTrainers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "No trainers found matching your search." : "No trainers added yet."}
            </div>
          )}
        </CardContent>
      </Card>

      <AddTrainerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          refetch();
          setIsAddDialogOpen(false);
        }}
      />
    </>
  );
}
