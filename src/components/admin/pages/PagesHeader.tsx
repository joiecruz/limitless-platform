import { CreatePageDialog } from "./CreatePageDialog";

export function PagesHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Landing Pages</h1>
        <p className="text-muted-foreground mt-1">
          Manage your website's landing pages
        </p>
      </div>
      <CreatePageDialog />
    </div>
  );
}