import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CoDesignProcess() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">What Makes Us Different: Our Co-Design Process</h2>
        <p className="text-lg text-gray-600 mb-12">
          Our signature co-design process makes sure that our clients and their stakeholders are part of the innovation journey. 
          When innovations and solutions are co-designed, we achieve greater ownership and greater impact.
        </p>
        
        <img 
          src="https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Co-Design%20Diamond.png"
          alt="Co-Design Process"
          className="w-full mb-12 rounded-lg"
        />

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discover">Discover</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="deliver">Deliver</TabsTrigger>
            <TabsTrigger value="debrief">Debrief</TabsTrigger>
          </TabsList>
          <TabsContent value="discover" className="mt-6 text-left">
            <h3 className="text-xl font-semibold mb-3">Discover Phase</h3>
            <p className="text-gray-600">
              The discovery phase begins with a Project Kick-off Meeting. This initial meeting sets the stage for our collaboration, aligning everyone on project goals, timelines, and expectations. The heart of the discovery phase is our 4-Hour Co-Design Workshop, where stakeholders collaborate, share insights, and start building a shared understanding of the user's needs. We then conduct In-Depth Empathy Interviews, immersing ourselves in the user's environment to gather detailed insights and form a comprehensive understanding of their perspectives, needs, and aspirations.
            </p>
          </TabsContent>
          <TabsContent value="design" className="mt-6 text-left">
            <h3 className="text-xl font-semibold mb-3">Design Phase</h3>
            <p className="text-gray-600">
              The design phase starts with the Creation of a Design Strategy Deck, outlining our approach to tackling the challenge based on insights gathered during the discovery phase. We then establish a coherent visual language with the Creation of Branding Guidelines and a Design System. This ensures consistency and recognizability in our solution. With a solid foundation in place, we move on to the Creation of Low-Fidelity Prototypes, translating our strategic thinking into tangible solutions that can be tested and evaluated.
            </p>
          </TabsContent>
          <TabsContent value="deliver" className="mt-6 text-left">
            <h3 className="text-xl font-semibold mb-3">Deliver Phase</h3>
            <p className="text-gray-600">
              The delivery phase begins with the Creation of Medium- to High-Fidelity Prototypes, bringing our designs closer to the final product. We conduct Testing, Iterations, and Revisions, gathering user feedback and refining our prototypes based on these insights. This cycle continues until we're ready for the Launching of the Social Innovation Product, marking the implementation of our collaborative solution in the real world.
            </p>
          </TabsContent>
          <TabsContent value="debrief" className="mt-6 text-left">
            <h3 className="text-xl font-semibold mb-3">Debrief Phase</h3>
            <p className="text-gray-600">
              The debrief phase ensures a smooth Project Turnover to the Client and Partner. We provide all necessary files, documentation, and knowledge for you to continue managing the solution moving forward. We conclude with a Project Retrospective, where we review the process, the outcomes, and the lessons learned. This opportunity for reflection allows us to continually refine our approach and set the stage for future collaborations.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}