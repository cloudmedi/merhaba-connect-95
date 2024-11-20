import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Music2, PlayCircle } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Music Management System</h1>
        <p className="text-muted-foreground">Professional music management solution for businesses</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
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
              <PlayCircle className="h-5 w-5" />
              Music Player
            </CardTitle>
            <CardDescription>Branch music player application</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate("/player")}
            >
              Launch Player
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}