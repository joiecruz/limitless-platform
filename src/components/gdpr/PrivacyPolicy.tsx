import { ScrollArea } from "@/components/ui/scroll-area";

export function PrivacyPolicy() {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Privacy Policy</h2>
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-2">
          <h3 className="text-lg font-semibold">1. Data We Collect</h3>
          <p>We collect and process the following data:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Email address</li>
            <li>Profile information (name, role, company size)</li>
            <li>Usage data</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">2. How We Use Your Data</h3>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and maintain our service</li>
            <li>Notify you about changes to our service</li>
            <li>Provide customer support</li>
            <li>Monitor the usage of our service</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">3. Your Rights</h3>
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal data</li>
            <li>Rectify your personal data</li>
            <li>Erase your personal data</li>
            <li>Restrict processing of your personal data</li>
            <li>Data portability</li>
            <li>Object to processing of your personal data</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold">4. Contact Us</h3>
          <p>
            For any questions about this Privacy Policy, please contact us at:
            privacy@example.com
          </p>
        </section>
      </div>
    </ScrollArea>
  );
}