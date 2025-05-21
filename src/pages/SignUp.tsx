
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [house, setHouse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would handle user registration
    console.log("Registration attempt with:", { name, email, house });
  };
  
  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-dsfl-darkblue p-8 md:p-12 flex flex-col">
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-dsfl-primary rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-dsfl-darkblue rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-dsfl-primary rounded-md rotate-45"></div>
              </div>
            </div>
            <div className="text-xl font-bold">
              <span className="text-dsfl-primary">DSFL</span>
            </div>
          </Link>
        </div>
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
          <p className="text-gray-400">Already have an account? <Link to="/login" className="text-dsfl-primary">Login</Link></p>
        </div>
        
        <div className="mt-8">
          <button className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12L16 12" />
              <path d="M12 8L12 16" />
            </svg>
            Continue With Google
          </button>
        </div>
        
        <div className="my-6 flex items-center">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border-gray-700"
                placeholder="John Doe"
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
                className="w-full bg-gray-800 border-gray-700"
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
                  className="w-full bg-gray-800 border-gray-700"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters with a number and special character</p>
            </div>
          </div>
          
          <Button type="submit" className="mt-6 bg-dsfl-primary hover:bg-dsfl-secondary text-white">
            Create Account
          </Button>
          
          <p className="mt-4 text-xs text-gray-400 text-center">
            By signing up, you agree to our <Link to="#" className="text-dsfl-primary">Terms of Service</Link> and <Link to="#" className="text-dsfl-primary">Privacy Policy</Link>
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

export default SignUp;
