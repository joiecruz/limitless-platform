import { Editor, Frame, Element } from '@craftjs/core';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Basic components that can be dragged
const Text = ({ text }: { text: string }) => {
  return <p className="text-gray-700">{text}</p>;
};

const Heading = ({ text }: { text: string }) => {
  return <h2 className="text-2xl font-bold mb-4">{text}</h2>;
};

const Image = ({ src, alt }: { src: string; alt: string }) => {
  return <img src={src} alt={alt} className="max-w-full h-auto rounded-lg" />;
};

const Container = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4 border rounded-lg bg-white">{children}</div>;
};

export const PageBuilderEditor = ({ pageId }: { pageId?: string }) => {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (json: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('pages')
        .upsert({
          id: pageId,
          content: json,
          title: 'New Page', // You might want to make this editable
          slug: 'new-page', // You might want to make this editable
          published: false
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Page saved successfully",
      });
    } catch (error) {
      console.error('Error saving page:', error);
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full">
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Page Builder</h2>
          <Button 
            onClick={() => handleSave({})} 
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
        
        <div className="grid grid-cols-12 gap-4">
          {/* Components Panel */}
          <div className="col-span-3 border-r pr-4">
            <h3 className="font-medium mb-3">Components</h3>
            <div className="space-y-2">
              <div className="p-2 border rounded cursor-move hover:bg-gray-50">
                Text Block
              </div>
              <div className="p-2 border rounded cursor-move hover:bg-gray-50">
                Heading
              </div>
              <div className="p-2 border rounded cursor-move hover:bg-gray-50">
                Image
              </div>
              <div className="p-2 border rounded cursor-move hover:bg-gray-50">
                Container
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div className="col-span-9">
            <Editor
              resolver={{
                Text,
                Heading,
                Image,
                Container
              }}
            >
              <Frame>
                <Element
                  canvas
                  is={Container}
                >
                  <Heading text="Welcome to your new page" />
                  <Text text="Start editing by dragging components from the left panel." />
                </Element>
              </Frame>
            </Editor>
          </div>
        </div>
      </Card>
    </div>
  );
};