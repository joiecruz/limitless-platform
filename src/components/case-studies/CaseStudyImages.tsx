import { thumbUrl } from "@/lib/imageUrl";

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
              src={thumbUrl(coverPhoto, { width: 1200 })}
              alt={name}
              className="w-full h-full object-cover"
              loading="eager"
              width={1200}
              height={675}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
        {additionalPhoto1 && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={thumbUrl(additionalPhoto1, { width: 800 })}
              alt="Additional case study photo 1"
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={450}
            />
          </div>
        )}
        {additionalPhoto2 && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={thumbUrl(additionalPhoto2, { width: 800 })}
              alt="Additional case study photo 2"
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={450}
            />
          </div>
        )}
      </div>
    </>
  );
}