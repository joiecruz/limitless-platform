
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  created_at: string;
}

export function RecordingsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: recordings = [], isLoading } = useQuery({
    queryKey: ['master-trainer-recordings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_trainer_recordings')
        .select('*')
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Training Recordings</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage Zoom recordings and LMS content for master trainers
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Recording
          </Button>
        </div>
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
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecordings.map((recording) => (
                <TableRow key={recording.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{recording.title}</p>
                        {recording.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {recording.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recording.category}</Badge>
                  </TableCell>
                  <TableCell>{formatDuration(recording.duration)}</TableCell>
                  <TableCell>{recording.view_count}</TableCell>
                  <TableCell>
                    <Badge variant={recording.is_active ? "default" : "destructive"}>
                      {recording.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(recording.video_url, '_blank')}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Watch
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRecordings.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm || selectedCategory !== "all" 
              ? "No recordings found matching your filters." 
              : "No recordings uploaded yet."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
