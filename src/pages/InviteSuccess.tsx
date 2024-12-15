export default function InviteSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
        <p className="text-muted-foreground">
          We've sent you a confirmation email. Click the link in the email to join your workspace.
        </p>
        <div className="mt-8">
          <img 
            src="/lovable-uploads/0dd5367c-3e22-4eff-a5b1-2604397dfba8.png" 
            alt="Email sent" 
            className="mx-auto w-48 h-48"
          />
        </div>
      </div>
    </div>
  );
}