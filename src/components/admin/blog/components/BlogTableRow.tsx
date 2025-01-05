import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate } from "../utils/dateFormatter";

interface Blog {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface BlogTableRowProps {
  blog: Blog;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
}

export function BlogTableRow({ blog, onDelete, onTogglePublish }: BlogTableRowProps) {
  const navigate = useNavigate();

  return (
    <TableRow key={blog.id}>
      <TableCell className="font-medium">{blog.title}</TableCell>
      <TableCell>{blog.slug}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs ${
          blog.published 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {blog.published ? 'Published' : 'Draft'}
        </span>
      </TableCell>
      <TableCell>{formatDate(blog.created_at)}</TableCell>
      <TableCell>{formatDate(blog.updated_at)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onTogglePublish(blog.id, blog.published)}
                >
                  {blog.published ? (
                    <XCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{blog.published ? 'Unpublish' : 'Publish'} post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/admin/content/blog/${blog.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit post</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(blog.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}