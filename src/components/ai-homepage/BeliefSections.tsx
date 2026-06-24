import futureHumanAi from "@/assets/future-human-ai.png.asset.json";
import transformationsImg from "@/assets/transformations.png.asset.json";

export function BeliefFutureSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center order-2 lg:order-1">
          <img
            src={futureHumanAi.url}
            alt="Human and AI working together toward a brighter future"
            className="w-full max-w-md h-auto"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p
            className="text-sm sm:text-base font-bold text-[#393CA0] uppercase tracking-widest mb-4"
            style={{ fontFamily: '"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif' }}
          >
            Our belief
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            The future is{" "}
            <span className="line-through decoration-2 text-gray-400">AI</span>{" "}
            <span className="text-[#66E6F5]">HUMAN + AI</span>
          </h2>
          <div className="space-y-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
            <p>
              Technology accelerates what humans decide to do with it. That's why we never put the tool before the person.
            </p>
            <p>
              Every program, product, and engagement we design starts with one question: what does this human need to thrive? AI is the amplifier. Human capacity is the foundation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BeliefTransformationSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p
            className="text-sm sm:text-base font-bold text-[#393CA0] uppercase tracking-widest mb-4"
            style={{ fontFamily: '"Times New Roman MT Condensed Bold", "Times New Roman", Times, serif' }}
          >
            Our belief
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Transformation by design
          </h2>
          <div className="space-y-4 text-lg sm:text-xl text-gray-600 leading-relaxed">
            <p>
              Change doesn't happen by accident. And it doesn't happen in a one-day workshop either.
            </p>
            <p>
              Real transformation requires a system: the right mindsets built first, the right tools introduced next, and the right structures put in place to make it stick. That's the Limitless approach. Every engagement is designed from the outcome backward, so you're not just inspired — you're equipped.
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <img
            src={transformationsImg.url}
            alt="Transformation from uncertainty to clarity and capability"
            className="w-full max-w-lg h-auto"
          />
        </div>
      </div>
    </section>
  );
}
