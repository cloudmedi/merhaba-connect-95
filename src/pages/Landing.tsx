import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/landing/MainNav";
import { NewFooter } from "@/components/landing/NewFooter";
import { ArrowRight, BarChart3, Mail, CheckCircle2, Activity, MessageSquare } from "lucide-react";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";

export default function Landing() {
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

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
              <img
                src="/lovable-uploads/7146bd9c-32ac-47d5-b3cf-60bbaa083785.png"
                alt="Dashboard Preview"
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 bg-[#CCFF99] rounded-[40px] mx-4 my-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Core Features
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-[#8A2BE2] bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Contact Management</h3>
              <p className="text-gray-600">Manage all your customer interactions in one place.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-[#8A2BE2] bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sales Automation</h3>
              <p className="text-gray-600">Automate your sales process and close more deals.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-[#8A2BE2] bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Email Integration</h3>
              <p className="text-gray-600">Seamlessly integrate with your email workflow.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-[#8A2BE2] bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Task and Activity</h3>
              <p className="text-gray-600">Track and manage all your tasks efficiently.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-[#8A2BE2] bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reporting and Analytics</h3>
              <p className="text-gray-600">Get insights with powerful reporting tools.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl">
              <div className="w-12 h-12 bg-[#8A2BE2] bg-opacity-10 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-[#8A2BE2]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Support</h3>
              <p className="text-gray-600">Provide excellent support to your customers.</p>
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