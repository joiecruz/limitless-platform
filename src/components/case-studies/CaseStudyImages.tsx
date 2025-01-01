interface CaseStudyImagesProps {
  coverPhoto?: string;
  name: string;
  additionalPhoto1?: string;
  additionalPhoto2?: string;
}

export function CaseStudyImages({ coverPhoto, name, additionalPhoto1, additionalPhoto2 }: CaseStudyImagesProps) {
  return (
    <>
      {coverPhoto && (
        <div className="w-full mb-12">
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <img
              src={coverPhoto}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        {additionalPhoto1 && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={additionalPhoto1}
              alt="Additional case study photo 1"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {additionalPhoto2 && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={additionalPhoto2}
              alt="Additional case study photo 2"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </>
  );
}