import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";

export default function Projects() {
  const benefits = [
    "AI-powered project ideation and validation",
    "Unlimited project workspaces",
    "Advanced analytics and insights",
    "Priority support",
    "Early access to new features",
    "Custom AI model training",
    "Dedicated success manager",
    "API access",
  ];

  return (
    <div className="container max-w-6xl py-8 space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary-600">
          Innovation Management Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our AI is currently learning the art of project management... and
          procrastination. But don't worry, it's getting better at the former! 🚀
        </p>
      </div>

      {/* Lifetime Deal Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Lifetime Access
          </h2>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-primary-600">$299</span>
            <span className="text-gray-500 line-through">$999</span>
          </div>
          <p className="text-gray-600">One-time payment, lifetime access</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80%]">Feature</TableHead>
              <TableHead>Included</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefits.map((benefit) => (
              <TableRow key={benefit}>
                <TableCell className="font-medium">{benefit}</TableCell>
                <TableCell>
                  <Check className="h-5 w-5 text-primary-600" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="text-center pt-6">
          <Button size="lg" className="w-full sm:w-auto">
            Get Lifetime Access
          </Button>
          <p className="mt-2 text-sm text-gray-500">
            Limited time offer • 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}