import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to Limitless Lab</h1>
          <p className="text-gray-600">
            Start building your amazing application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;