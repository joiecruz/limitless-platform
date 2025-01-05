import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlogsTable from "@/components/admin/blog/BlogsTable";
import { CaseStudiesTable } from "@/components/admin/case-studies/CaseStudiesTable";
import { LogosTable } from "@/components/admin/logos/LogosTable";
import { ToolsTable } from "@/components/admin/tools/ToolsTable";

export default function AdminContent() {
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
          <BlogsTable />
        </TabsContent>
        
        <TabsContent value="case-studies" className="space-y-4">
          <CaseStudiesTable />
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <ToolsTable />
        </TabsContent>
        
        <TabsContent value="logos" className="space-y-4">
          <LogosTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}