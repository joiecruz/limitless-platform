
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_type: string;
  download_count: number;
  is_active: boolean;
}

export function UserMaterialsViewer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['user-master-trainer-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_trainer_materials')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Material[];
    }
  });

  const categories = Array.from(new Set(materials.map(m => m.category)));
  
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (material.description && material.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (material: Material) => {
    // Increment download count
    await supabase
      .from('master_trainer_materials')
      .update({ download_count: material.download_count + 1 })
      .eq('id', material.id);
    
    // Open download link
    window.open(material.file_url, '_blank');
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
        <CardTitle>Exclusive Materials</CardTitle>
        <p className="text-sm text-muted-foreground">
          Access premium toolkit materials and resources
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
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
          {filteredMaterials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <FileText className="h-8 w-8 text-blue-600 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-2">{material.title}</h3>
                    {material.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {material.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline">{material.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {material.file_type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {material.download_count} downloads
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleDownload(material)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm || selectedCategory !== "all" 
              ? "No materials found matching your filters." 
              : "No materials available."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
