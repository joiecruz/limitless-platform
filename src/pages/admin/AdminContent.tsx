import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogsTable } from "@/components/admin/blog/BlogsTable";
import { CreateBlogDialog } from "@/components/admin/blog/CreateBlogDialog";
import { CaseStudiesTable } from "@/components/admin/case-studies/CaseStudiesTable";
import { CreateCaseStudyDialog } from "@/components/admin/case-studies/CreateCaseStudyDialog";

export default function AdminContent() {
  return (
    <div className="p-6">
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Articles</h2>
            <CreateBlogDialog />
          </div>
          <BlogsTable />
        </TabsContent>

        <TabsContent value="case-studies" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Case Studies</h2>
            <CreateCaseStudyDialog />
          </div>
          <CaseStudiesTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}