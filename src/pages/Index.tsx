import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music2, Building2 } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  console.log("Index page rendering"); // Debug için log ekledim

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

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="h-5 w-5" />
                Super Admin Panel
              </CardTitle>
              <CardDescription>
                Central management system for all branches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-primary" 
                onClick={() => navigate("/super-admin")}
              >
                Access Super Admin
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
                Branch management dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                variant="secondary"
                onClick={() => navigate("/manager")}
              >
                Access Manager Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}