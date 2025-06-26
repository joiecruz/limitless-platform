
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Recording {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: number | null;
  category: string;
  thumbnail_url: string | null;
  view_count: number;
  is_active: boolean;
}

export function UserRecordingsViewer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: recordings = [], isLoading } = useQuery({
    queryKey: ['user-master-trainer-recordings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_trainer_recordings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Recording[];
    }
  });

  const categories = Array.from(new Set(recordings.map(r => r.category)));
  
  const filteredRecordings = recordings.filter(recording => {
    const matchesSearch = recording.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recording.description && recording.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || recording.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleWatch = async (recording: Recording) => {
    // Increment view count
    await supabase
      .from('master_trainer_recordings')
      .update({ view_count: recording.view_count + 1 })
      .eq('id', recording.id);
    
    // Open video link
    window.open(recording.video_url, '_blank');
  };

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
        <CardTitle>Training Recordings</CardTitle>
        <p className="text-sm text-muted-foreground">
          Watch exclusive training sessions and recorded workshops
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md min-w-[120px]"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecordings.map((recording) => (
            <Card key={recording.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg">{recording.title}</h3>
                    <Badge variant="outline">{recording.category}</Badge>
                  </div>
                  
                  {recording.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {recording.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Duration: {formatDuration(recording.duration)}</span>
                    <span>{recording.view_count} views</span>
                  </div>
                  
                  <Button
                    onClick={() => handleWatch(recording)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Watch Recording
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecordings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm || selectedCategory !== "all" 
              ? "No recordings found matching your filters." 
              : "No recordings available."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
