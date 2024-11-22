import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music2, Building2, Desktop } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const handleDesktopDownload = () => {
    // Desktop uygulaması indirme linki - bu kısmı daha sonra gerçek link ile güncelleyeceğiz
    window.open('https://github.com/your-repo/releases/latest', '_blank');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Music Management System</h1>
        <p className="text-muted-foreground">Professional music management solution for businesses</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="h-5 w-5" />
              Super Admin Panel
            </CardTitle>
            <CardDescription>Central management system for all branches</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
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
            <CardDescription>Branch management dashboard</CardDescription>
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

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Desktop className="h-5 w-5" />
              Desktop Player
            </CardTitle>
            <CardDescription>Download desktop application for branch players</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              variant="outline"
              onClick={handleDesktopDownload}
            >
              Download Desktop App
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}