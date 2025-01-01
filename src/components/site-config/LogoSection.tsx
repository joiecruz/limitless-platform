import { Suspense } from "react";
import { InfiniteLogos } from "./InfiniteLogos";
import { LoadingPage } from "@/components/common/LoadingPage";

export function LogoSection() {
  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
          Join the growing network of organizations innovating for social good
        </h3>
      </div>
      <Suspense fallback={<LoadingPage />}>
        <div className="space-y-4">
          <InfiniteLogos direction="left" logoGroup="rectangular" />
          <InfiniteLogos direction="right" logoGroup="square" />
        </div>
      </Suspense>
    </div>
  );
}