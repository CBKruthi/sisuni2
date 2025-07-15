import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo login logic - replace with actual authentication
    if (formData.email && formData.password) {
      // Store user session
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Check if admin
      if (formData.email === 'admin@sisuni.tech') {
        localStorage.setItem('isAdmin', 'true');
      }
      
      toast({
        title: "Login Successful!",
        description: "Welcome back to Sisuni Tech",
      });
      
      navigate('/career');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-md mx-auto px-4 py-20">
        <Card className="shadow-tech border-purple-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <CardTitle className="text-2xl text-purple-800">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Sisuni Tech account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-purple-700">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="pl-10 border-purple-200 focus:border-purple-500"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-purple-700">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 border-purple-200 focus:border-purple-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-purple-400 hover:text-purple-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-purple-600 hover:text-purple-800 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700">
                <strong>Demo Credentials:</strong><br />
                User: any email + password<br />
                Admin: admin@sisuni.tech + any password
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;