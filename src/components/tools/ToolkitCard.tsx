
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toolkit } from "@/types/toolkit";
import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";

interface ToolkitCardProps {
  toolkit: Toolkit;
}

export function ToolkitCard({ toolkit }: ToolkitCardProps) {
  return (
    <Link to={`/tools/toolkit/${toolkit.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-[16/9] relative">
          <img
            src={toolkit.cover_image_url || "/placeholder.svg"}
            alt={toolkit.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700">
            <FolderOpen className="w-3 h-3 mr-1" />
            Toolkit
          </Badge>
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-2">{toolkit.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2">
            {toolkit.description || "A collection of related tools and resources."}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
