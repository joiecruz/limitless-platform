
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TrainerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  expertise_areas: string[] | null;
  profile_image_url: string | null;
  is_active: boolean;
}

export function UserTrainersDirectory() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ['user-master-trainer-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_trainer_profiles')
        .select('*')
        .eq('is_active', true)
        .order('first_name', { ascending: true });

      if (error) throw error;
      return data as TrainerProfile[];
    }
  });

  const filteredTrainers = trainers.filter(trainer =>
    `${trainer.first_name} ${trainer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <Card>
      <CardHeader>
        <CardTitle>Master Trainers Directory</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect with certified innovation experts and master trainers
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trainers by name or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrainers.map((trainer) => {
            const initials = `${trainer.first_name[0]}${trainer.last_name[0]}`;
            
            return (
              <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={trainer.profile_image_url || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">
                        {trainer.first_name} {trainer.last_name}
                      </h3>
                      {trainer.bio && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {trainer.bio}
                        </p>
                      )}
                      {trainer.expertise_areas && trainer.expertise_areas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {trainer.expertise_areas.slice(0, 3).map((area) => (
                            <Badge key={area} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {trainer.expertise_areas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{trainer.expertise_areas.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTrainers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm ? "No trainers found matching your search." : "No trainers available."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
