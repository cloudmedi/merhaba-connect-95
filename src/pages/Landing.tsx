import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Music2, 
  Calendar, 
  Bell, 
  Settings, 
  Monitor, 
  BarChart3, 
  Users, 
  PlayCircle,
  Building2
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Playlist Management",
      description: "Create, edit and manage music playlists with ease. Organize songs by genre, mood, and categories.",
      icon: Music2,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Schedule Control",
      description: "Plan and schedule music playback for different times and locations. Set up recurring schedules.",
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Device Management",
      description: "Monitor and control all your music devices from one central dashboard.",
      icon: Monitor,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Announcements",
      description: "Create and manage announcements that play between songs or at scheduled times.",
      icon: Bell,
      color: "text-amber-500",
      bgColor: "bg-amber-100"
    },
    {
      title: "Real-time Analytics",
      description: "Track play counts, popular songs, and device performance metrics.",
      icon: BarChart3,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100"
    },
    {
      title: "Multi-branch Support",
      description: "Manage music across multiple locations with branch-specific settings.",
      icon: Building2,
      color: "text-rose-500",
      bgColor: "bg-rose-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Professional Music Management System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Control your business music ecosystem with our comprehensive management platform.
              Schedule, manage, and monitor your music across all locations.
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate("/manager")}
                className="bg-[#6E59A5] hover:bg-[#5A478A]"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Launch Dashboard
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/manager/register")}
              >
                <Users className="mr-2 h-5 w-5" />
                Register Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comprehensive Management Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your business music system in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#6E59A5] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Business Music?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using our platform to create the perfect atmosphere for their customers.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/manager/register")}
              className="bg-white text-[#6E59A5] hover:bg-gray-100"
            >
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}