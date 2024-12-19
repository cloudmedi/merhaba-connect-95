import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music2, Building2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { TrialForm } from "@/components/landing/TrialForm";

export default function Index() {
  const navigate = useNavigate();
  const [isTrialFormOpen, setIsTrialFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-6 mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Professional Music Management
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Enhance your business atmosphere with our enterprise-grade music solution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          <Card className="bg-white/50 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ArrowRight className="h-5 w-5 text-[#6E59A5]" />
                Landing Page
              </CardTitle>
              <CardDescription>
                Explore our features and solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200" 
                onClick={() => navigate("/landing")}
              >
                View Features
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Music2 className="h-5 w-5 text-[#6E59A5]" />
                Admin Panel
              </CardTitle>
              <CardDescription>
                System administration dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-[#6E59A5] hover:bg-[#5A478A] text-white" 
                onClick={() => navigate("/super-admin")}
              >
                Access Admin
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/50 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5 text-[#6E59A5]" />
                Manager Panel
              </CardTitle>
              <CardDescription>
                Branch management console
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-[#6E59A5] hover:bg-[#5A478A] text-white"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <TrialForm 
        open={isTrialFormOpen} 
        onOpenChange={setIsTrialFormOpen}
      />
    </div>
  );
}