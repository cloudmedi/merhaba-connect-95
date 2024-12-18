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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Music Management System
          </h1>
          <p className="text-lg text-gray-600">
            Professional music management solution for businesses
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Landing Page
              </CardTitle>
              <CardDescription>
                Ürün özellikleri ve tanıtım
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50" 
                onClick={() => navigate("/landing")}
              >
                Ürünü İncele
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="h-5 w-5" />
                Super Admin Panel
              </CardTitle>
              <CardDescription>
                Merkezi yönetim sistemi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-primary" 
                onClick={() => navigate("/super-admin")}
              >
                Giriş Yap
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Manager Panel
              </CardTitle>
              <CardDescription>
                Şube yönetim paneli
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-[#6E59A5] hover:bg-[#5A478A] text-white"
                onClick={() => setIsTrialFormOpen(true)}
              >
                Ücretsiz Deneyin
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