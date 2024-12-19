import { MessageSquare, Activity, Mail, CheckCircle2, BarChart3 } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 bg-[#CCFF99] rounded-[40px] mx-4 my-8">
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
  );
}