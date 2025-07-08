
import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  blogId?: string;
}

export function RichTextEditor({ value, onChange, className, blogId }: RichTextEditorProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Only update when content actually changes to prevent flickering
      const html = editor.getHTML();
      if (html !== value) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });

  const addImage = useCallback(async (file: File) => {
    if (!editor) return;
    
    setIsUploading(true);
    
    try {
      if (!file || !file.type.includes('image')) {
        toast({
          title: "Invalid file",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = blogId 
        ? `blog/${blogId}/${fileName}`
        : `blog/temp/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('blog-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath);

      if (publicUrl) {
        // Insert image at current position - using setImage instead of insertImage
        editor
          .chain()
          .focus()
          .setImage({ src: publicUrl.publicUrl, alt: file.name })
          .run();
          
        toast({
          title: "Image uploaded",
          description: "Image has been added to the content",
        });
      }
    } catch (error: any) {
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [editor, blogId, toast]);

  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        await addImage(target.files[0]);
      }
    };
    input.click();
  }, [addImage]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("border rounded-md", className)}>
      <div className="border-b bg-muted/50 p-1 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
          type="button"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          type="button"
          disabled={isUploading}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          type="button"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          type="button"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
