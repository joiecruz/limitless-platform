import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <img 
            src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/sign/web-assets/Limitless%20Lab%20Logo%20SVG.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ3ZWItYXNzZXRzL0xpbWl0bGVzcyBMYWIgTG9nbyBTVkcuc3ZnIiwiaWF0IjoxNzMzNTkxMTc5LCJleHAiOjIwNDg5NTExNzl9.CBJpt7X0mbXpXxv8uMqmA7nBeoJpslY38xQKmPr7XQw"
            alt="Logo"
            className="h-12 mx-auto mb-6"
          />
        </div>

        <Card className="w-full">
          <CardContent className="pt-6 text-center">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-primary-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Verify your email address</h2>
              <p className="text-gray-600 mb-1">
                A verification email has been sent to{" "}
                <span className="font-medium text-gray-900">example@email.com</span>
              </p>
              <p className="text-gray-600">
                Please check your email and click the link provided to complete your account registration.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                If you don't receive the email within 5 minutes, please check your spam folder or click below to resend.
              </p>
              <Button className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resend Verification Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}