import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/landing/MainNav";
import { NewFooter } from "@/components/landing/NewFooter";
import { Features } from "@/components/landing/Features";
import { SystemStats } from "@/components/dashboard/SystemStats";
import { HeroPlaylist } from "@/components/dashboard/HeroPlaylist";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { MessageCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";

export default function Landing() {
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  // Sample playlist data for demo purposes
  const demoPlaylist = {
    id: 'demo-1',
    name: 'Featured Demo Playlist',
    artwork_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2940&auto=format&fit=crop'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <MainNav />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                A apps to grow your{" "}
                <span className="text-[#8A2BE2]">Start-up</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-xl">
                The soft landing management tool for start-ups that care about making an impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-[#8A2BE2] hover:bg-[#7B1FA2] rounded-full h-12 px-8 gap-2"
                  onClick={() => setIsTrialFormOpen(true)}
                >
                  Discover More <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -z-10 w-[500px] h-[500px] bg-[#F3F0FF] rounded-full blur-3xl opacity-30 -right-20 -top-20" />
              <HeroPlaylist 
                playlist={demoPlaylist}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <Features />

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <SystemStats />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Easily customize all your business reports
              </h2>
              <p className="text-gray-600">
                Get detailed insights into your business performance with customizable reports and analytics.
              </p>
              <Button 
                className="bg-[#8A2BE2] hover:bg-[#7B1FA2] rounded-full"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Speed up your analysis
              </h2>
              <p className="text-gray-600">
                Powerful analytics tools to help you make better decisions faster.
              </p>
              <Button 
                className="bg-[#8A2BE2] hover:bg-[#7B1FA2] rounded-full"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Try Now
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <PlaylistGrid 
                title="Featured Playlists"
                playlists={[]}
                isLoading={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            People are loving to using our software
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-gray-600">
                    "The platform has transformed how we manage our music. The analytics and reporting features are invaluable."
                  </p>
                  <div>
                    <h4 className="font-semibold">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Fitness Center Manager</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-gray-600">
                    "Easy to use, great selection of music, and excellent customer support. Highly recommended!"
                  </p>
                  <div>
                    <h4 className="font-semibold">Michael Chen</h4>
                    <p className="text-sm text-gray-500">Restaurant Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8A2BE2] py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Ready to see a personalized demo?
            </h2>
            <div className="flex justify-center gap-4">
              <Button 
                variant="secondary"
                size="lg"
                className="rounded-full"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Get Started
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="rounded-full bg-transparent text-white border-white hover:bg-white/10"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Talk to Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <NewFooter />

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}