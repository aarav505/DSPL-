import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [house, setHouse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState("");
  
  const { signUp, loading } = useAuth();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    checkPasswordStrength(password);
  }, [password]);
  
  const checkPasswordStrength = (pass: string) => {
    if (!pass) {
      setPasswordStrength(0);
      setPasswordMessage("");
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (pass.length >= 8) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[a-z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    
    setPasswordStrength(strength);
    
    if (strength < 3) {
      setPasswordMessage("Weak password");
    } else if (strength < 5) {
      setPasswordMessage("Medium password");
    } else {
      setPasswordMessage("Strong password");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordStrength < 3) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password.",
        variant: "destructive",
      });
      return;
    }
    
    await signUp(email, password, name, house);
  };
  
  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-dsfl-darkblue p-8 md:p-12 flex flex-col">
        <div className={`mb-8 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-dsfl-primary rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <div className="w-8 h-8 bg-dsfl-darkblue rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-dsfl-primary rounded-md rotate-45"></div>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={`mt-8 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
          <p className="text-gray-400">Already have an account? <Link to="/login" className="text-dsfl-primary hover:underline">Login</Link></p>
        </div>
        
        <form onSubmit={handleSubmit} className={`flex-1 flex flex-col mt-8 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 focus:border-dsfl-primary"
                placeholder="John"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border-gray-700 focus:border-dsfl-primary"
                placeholder="student@doonschool.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="house" className="block text-sm font-medium text-gray-400 mb-1">House</label>
              <select
                id="house"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-dsfl-primary"
                required
              >
                <option value="" disabled>Select your house</option>
                <option value="jaipur">Jaipur</option>
                <option value="kashmir">Kashmir</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="tata">Tata</option>
                <option value="oberoi">Oberoi</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-gray-800 border-gray-700 ${
                    password && passwordStrength < 3 
                      ? 'focus:border-red-500 border-red-700' 
                      : password && passwordStrength >= 3 
                        ? 'focus:border-green-500 border-green-700' 
                        : 'focus:border-dsfl-primary'
                  }`}
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dsfl-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          passwordStrength < 3 
                            ? 'bg-red-500' 
                            : passwordStrength < 5 
                              ? 'bg-yellow-500' 
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span 
                      className={`text-xs ${
                        passwordStrength < 3 
                          ? 'text-red-400' 
                          : passwordStrength < 5 
                            ? 'text-yellow-400' 
                            : 'text-green-400'
                      }`}
                    >
                      {passwordMessage}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    <PasswordRequirement 
                      text="At least 8 characters" 
                      isValid={password.length >= 8}
                    />
                    <PasswordRequirement 
                      text="Contains uppercase letter" 
                      isValid={/[A-Z]/.test(password)}
                    />
                    <PasswordRequirement 
                      text="Contains lowercase letter" 
                      isValid={/[a-z]/.test(password)}
                    />
                    <PasswordRequirement 
                      text="Contains number" 
                      isValid={/[0-9]/.test(password)}
                    />
                    <PasswordRequirement 
                      text="Contains special character" 
                      isValid={/[^A-Za-z0-9]/.test(password)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="mt-6 bg-dsfl-primary hover:bg-dsfl-secondary text-white relative overflow-hidden group"
            disabled={loading}
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-dsfl-secondary to-dsfl-primary group-hover:w-full transition-all duration-300 ease-out opacity-50"></span>
            <span className="relative">{loading ? 'Creating account...' : 'Create Account'}</span>
          </Button>
          
          <p className="mt-4 text-xs text-gray-400 text-center">
            By signing up, you agree to our <Link to="#" className="text-dsfl-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-dsfl-primary hover:underline">Privacy Policy</Link>
          </p>
        </form>
      </div>
      
      <div className="hidden md:block md:w-1/2 lg:w-3/5 xl:w-2/3 bg-center bg-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1554406473-1196733b0b1e?q=80&w=1978&auto=format&fit=crop')" }}>
        <div className="h-full w-full bg-gradient-to-r from-dsfl-dark/90 to-transparent flex items-center justify-center">
          <div className="p-12 max-w-lg">
            <h2 className="text-4xl font-bold mb-4">Join Our Inter House Fantasy Games</h2>
            <p className="text-gray-300">Create your dream team, compete with friends, and rise to the top of the leaderboard!</p>
            <div className="flex mt-6 space-x-2">
              <div className="w-2 h-2 rounded-full bg-dsfl-primary"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PasswordRequirement = ({ text, isValid }: { text: string; isValid: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      {isValid ? (
        <Check className="w-3 h-3 text-green-400" />
      ) : (
        <AlertCircle className="w-3 h-3 text-gray-400" />
      )}
      <span className={`text-xs ${isValid ? 'text-green-400' : 'text-gray-400'}`}>
        {text}
      </span>
    </div>
  );
};

export default SignUp;
