import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminCourses() {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);

  // Fetch courses
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch workspaces for the dropdown
  const { data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("id, name");
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch users for the dropdown
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleToggleLock = async (courseId: string, currentLockState: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ locked: !currentLockState })
        .eq("id", courseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Course ${currentLockState ? "unlocked" : "locked"} successfully`,
      });
    } catch (error) {
      console.error("Error toggling course lock:", error);
      toast({
        title: "Error",
        description: "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  const handleGrantAccess = async (type: "workspace" | "user", id: string) => {
    if (!selectedCourse) return;

    try {
      const table = type === "workspace" ? "workspace_course_access" : "user_course_access";
      const column = type === "workspace" ? "workspace_id" : "user_id";

      const { error } = await supabase
        .from(table)
        .insert({
          course_id: selectedCourse,
          [column]: id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Access granted to ${type}`,
      });
      
      setIsAccessDialogOpen(false);
    } catch (error) {
      console.error("Error granting access:", error);
      toast({
        title: "Error",
        description: "Failed to grant access",
        variant: "destructive",
      });
    }
  };

  if (isLoadingCourses) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>{course.enrollee_count || 0}</TableCell>
              <TableCell>
                {course.locked ? (
                  <Lock className="h-4 w-4 text-red-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-green-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleLock(course.id, !!course.locked)}
                  >
                    {course.locked ? "Unlock" : "Lock"}
                  </Button>
                  <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        Grant Access
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Grant Course Access</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Grant access to workspace</Label>
                          <Select onValueChange={(value) => handleGrantAccess("workspace", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select workspace" />
                            </SelectTrigger>
                            <SelectContent>
                              {workspaces?.map((workspace) => (
                                <SelectItem key={workspace.id} value={workspace.id}>
                                  {workspace.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Grant access to user</Label>
                          <Select onValueChange={(value) => handleGrantAccess("user", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users?.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.email} ({user.first_name} {user.last_name})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}