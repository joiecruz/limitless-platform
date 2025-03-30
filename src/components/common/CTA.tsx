import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Ready to dive deeper?
          <br />
          Let's connect and explore possibilities.
        </h2>
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            to="/contact"
            className="rounded-md bg-[#393CA0] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2D2E7A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#393CA0]"
          >
            Get in touch
          </Link>
          <Link to="/about" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more about us <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 