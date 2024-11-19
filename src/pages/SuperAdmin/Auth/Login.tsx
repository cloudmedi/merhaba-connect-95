import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Music2 } from "lucide-react";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual login logic
    if (email && password) {
      toast({
        title: "Login successful",
        description: "Welcome back, Super Admin",
      });
      navigate("/super-admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A1F2C] to-[#2C3444]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Music2 className="h-6 w-6 text-[#9b87f5]" />
            <h2 className="text-2xl font-bold">Merhaba Music</h2>
          </div>
          <CardTitle className="text-2xl">Super Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the super admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#9b87f5] hover:bg-[#8b77e5]">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}