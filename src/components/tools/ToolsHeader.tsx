interface ToolsHeaderProps {
  title: string;
  description: string;
}

export function ToolsHeader({ title, description }: ToolsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}