import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Radio } from "lucide-react";

export default function ManagerRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual registration logic
    if (email && password && companyName) {
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      navigate("/manager/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="h-6 w-6 text-[#FFD700]" />
            <h2 className="text-2xl font-bold">Cloud Media</h2>
          </div>
          <CardTitle className="text-2xl">Manager Registration</CardTitle>
          <CardDescription>
            Create your manager account to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
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
            <Button type="submit" className="w-full">
              Register
            </Button>
            <div className="text-center text-sm">
              <a 
                href="/manager/login" 
                className="text-[#FFD700] hover:underline"
              >
                Already have an account? Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}