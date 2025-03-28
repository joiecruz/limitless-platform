
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BlogsTable from "@/components/admin/blog/BlogsTable";
import { CaseStudiesTable } from "@/components/admin/case-studies/CaseStudiesTable";
import { LogosTable } from "@/components/admin/logos/LogosTable";
import { ToolsTable } from "@/components/admin/tools/ToolsTable";
import { useNavigate } from "react-router-dom";
import { CreateCaseStudyDialog } from "@/components/admin/case-studies/CreateCaseStudyDialog";
import { AddLogoDialog } from "@/components/admin/logos/AddLogoDialog";
import { Book, Briefcase, Image, Plus } from "lucide-react";

export default function AdminContent() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Management</h1>
        <p className="text-muted-foreground">
          Manage your website content including blog posts, case studies, and more.
        </p>
      </div>

      <Tabs defaultValue="blog">
        <TabsList>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="logos">Client Logos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blog" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => navigate("/admin/blog/create")}>
              <Book className="h-4 w-4 mr-2" />
              Add Blog Post
            </Button>
          </div>
          <BlogsTable />
        </TabsContent>
        
        <TabsContent value="case-studies" className="space-y-4">
          <div className="flex justify-end mb-4">
            <CreateCaseStudyDialog />
          </div>
          <CaseStudiesTable />
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <ToolsTable />
        </TabsContent>
        
        <TabsContent value="logos" className="space-y-4">
          <div className="flex justify-end mb-4">
            <AddLogoDialog />
          </div>
          <LogosTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
