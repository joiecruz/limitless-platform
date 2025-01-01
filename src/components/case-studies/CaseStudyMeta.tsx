interface CaseStudyMetaProps {
  client?: string;
  sdgs?: string[];
  services?: string[];
}

export function CaseStudyMeta({ client, sdgs, services }: CaseStudyMetaProps) {
  return (
    <div className="lg:col-span-4">
      {client && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Clients & Partners</h3>
          <p className="text-gray-900">{client}</p>
        </div>
      )}

      {sdgs && sdgs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">SDGs</h3>
          <div className="flex flex-wrap gap-2">
            {sdgs.map((sdg: string) => (
              <span
                key={sdg}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {sdg}
              </span>
            ))}
          </div>
        </div>
      )}

      {services && services.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Services</h3>
          <div className="flex flex-wrap gap-2">
            {services.map((service: string) => (
              <span
                key={service}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}