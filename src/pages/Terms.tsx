import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
          </p>

          <h2>2. Use of Services</h2>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms of Service.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our services are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
          </p>

          <h2>6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material changes.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}