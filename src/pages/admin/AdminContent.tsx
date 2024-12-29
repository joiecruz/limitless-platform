import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddLogoDialog } from "@/components/admin/logos/AddLogoDialog";
import { LogosTable } from "@/components/admin/logos/LogosTable";
import { BlogsTable } from "@/components/admin/blog/BlogsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminContent() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList>
          <TabsTrigger value="articles">Blog Articles</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="logos">Client Logos</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Blog Articles</h2>
            <Button onClick={() => navigate("/admin/content/blog/create")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Blog Post
            </Button>
          </div>
          <BlogsTable />
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">Testimonials management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="case-studies">
          <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">Case studies management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="logos" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Join the growing network of organizations innovating for social good</h2>
            <AddLogoDialog />
          </div>
          <LogosTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}