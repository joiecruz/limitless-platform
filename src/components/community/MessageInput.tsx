import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      onSendMessage("", publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder={`Message ${channelName || ''}`}
        className="flex-1 rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Image className="h-5 w-5" />
      </Button>
      <Button type="submit" disabled={!newMessage.trim() || isUploading}>
        Send
      </Button>
    </form>
  );
}