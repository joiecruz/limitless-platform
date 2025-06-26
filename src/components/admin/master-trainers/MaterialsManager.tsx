
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, FileText } from "lucide-react";
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
import { AddMaterialDialog } from "./AddMaterialDialog";

interface Material {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
  download_count: number;
  is_active: boolean;
  created_at: string;
}

export function MaterialsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: materials = [], isLoading, refetch } = useQuery({
    queryKey: ['master-trainer-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('master_trainer_materials')
        .select('*')
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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Exclusive Materials</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage toolkit materials and resources for master trainers
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{material.title}</p>
                          {material.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {material.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{material.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {material.file_type.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatFileSize(material.file_size)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>{material.download_count}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={material.is_active ? "default" : "destructive"}>
                        {material.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(material.file_url, '_blank')}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm || selectedCategory !== "all" 
                ? "No materials found matching your filters." 
                : "No materials uploaded yet."}
            </div>
          )}
        </CardContent>
      </Card>

      <AddMaterialDialog
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
