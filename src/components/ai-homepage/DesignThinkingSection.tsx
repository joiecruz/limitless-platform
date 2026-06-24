import designThinkingImg from "@/assets/design-thinking-systems-ai.png.asset.json";

export function DesignThinkingSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p
            className="text-sm sm:text-base font-bold text-[#393CA0] uppercase tracking-widest mb-4"
            style={{ fontFamily: '"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif' }}
          >
            How we work
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Design Thinking and Systems Thinking, Amplified by AI
          </h2>
          <div className="space-y-6 text-lg sm:text-xl text-gray-600 leading-relaxed">
            <p>
              At Limitless Lab, we combine design thinking, systems thinking, and AI literacy into one integrated approach. Because the organizations that thrive won't be the ones who adopted AI fastest. They'll be the ones who understood their problems most clearly before they did.
            </p>
            <p>
              We work with teams to move from reactive adoption to intentional transformation: diagnosing the real challenge, designing the right response, and building the capability to keep going after we leave.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src={designThinkingImg.url}
            alt="Design Thinking and Systems Thinking connected by AI"
            className="w-full max-w-lg h-auto"
          />
        </div>
      </div>
    </section>
  );
}
