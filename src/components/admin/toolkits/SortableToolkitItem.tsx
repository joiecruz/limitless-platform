
import { SortableElement, SortableHandle } from "react-sortable-hoc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Download, Trash2 } from "lucide-react";

interface ToolkitItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  order_index: number | null;
  created_at: string;
}

interface SortableToolkitItemProps {
  item: ToolkitItem;
  onDelete: (id: string) => void;
}

const DragHandle = SortableHandle(() => (
  <div className="cursor-grab active:cursor-grabbing p-2">
    <GripVertical className="h-4 w-4 text-muted-foreground" />
  </div>
));

const ToolkitItemComponent = ({ item, onDelete }: SortableToolkitItemProps) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <DragHandle />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {item.file_url}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(item.file_url, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SortableToolkitItem = SortableElement(ToolkitItemComponent);
