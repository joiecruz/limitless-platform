
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTrainerDialog } from "./EditTrainerDialog";
import { DeleteTrainerDialog } from "./DeleteTrainerDialog";

interface TrainerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  expertise_areas: string[] | null;
  contact_info: any;
  profile_image_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface TrainerCardProps {
  trainer: TrainerProfile;
  onUpdate: () => void;
}

export function TrainerCard({ trainer, onUpdate }: TrainerCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const initials = `${trainer.first_name[0]}${trainer.last_name[0]}`;

  return (
    <>
      <Card className={`${!trainer.is_active ? 'opacity-60' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={trainer.profile_image_url || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {trainer.first_name} {trainer.last_name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {trainer.email}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {trainer.bio && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {trainer.bio}
            </p>
          )}
          {trainer.expertise_areas && trainer.expertise_areas.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {trainer.expertise_areas.slice(0, 3).map((area) => (
                <Badge key={area} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {trainer.expertise_areas.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{trainer.expertise_areas.length - 3} more
                </Badge>
              )}
            </div>
          )}
          {!trainer.is_active && (
            <Badge variant="destructive" className="text-xs">
              Inactive
            </Badge>
          )}
        </CardContent>
      </Card>

      <EditTrainerDialog
        trainer={trainer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          onUpdate();
          setIsEditDialogOpen(false);
        }}
      />

      <DeleteTrainerDialog
        trainer={trainer}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={() => {
          onUpdate();
          setIsDeleteDialogOpen(false);
        }}
      />
    </>
  );
}
