export function TheFutureSection() {
  return (
    <section className="py-24 bg-[#393CA0] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-10">
          The future is <span className="line-through decoration-[#66E6F5] decoration-4">AI</span>{" "}
          <span className="text-[#66E6F5]">Humans</span>.
        </h2>

        <div className="space-y-6 text-lg text-white/85 leading-relaxed max-w-3xl mx-auto text-left sm:text-center">
          <p>
            The real transformation isn't AI replacing people.
            <br className="hidden sm:block" />
            It's people learning how to think, work, and lead alongside AI.
          </p>
          <p>
            AI is powerful — but on its own, it changes very little.
          </p>
          <p>
            What creates real impact is how humans use it: how leaders decide, how teams collaborate, and how organizations evolve.
          </p>
          <p className="text-[#66E6F5] font-semibold text-xl mt-8">
            AI doesn't transform organizations. People do — with AI.
          </p>
        </div>
      </div>
    </section>
  );
}
