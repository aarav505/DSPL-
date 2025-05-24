
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabase';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const { user, signOut } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('Users')
            .select('name')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching user name:', error);
            return;
          }

          if (data?.name) {
            setUserName(data.name);
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      }
    };

    fetchUserName();
  }, [user]);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dsfl-darkblue/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="dsfl-container flex items-center justify-between h-16">
        <div className={`flex items-center gap-2 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-dsfl-primary rounded-full flex items-center justify-center transition-transform hover:scale-110">
              <div className="w-8 h-8 bg-dsfl-darkblue rounded-full flex items-center justify-center">
                <div className="w-5 h-5 bg-dsfl-primary rounded-md rotate-45"></div>
              </div>
            </div>
          </Link>
        </div>
        
        <div className={`hidden md:flex items-center space-x-8 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/my-team">My Team</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/leagues">Leagues</NavLink>
          <NavLink to="/points-system">Points System</NavLink>
          <NavLink to="/news">News</NavLink>
        </div>
        
        <div className={`flex items-center space-x-3 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm hidden md:block">
                Hi, {userName || 'User'}
              </span>
              <button 
                onClick={() => signOut()} 
                className="text-white px-4 py-1 border border-gray-700 rounded-lg hover:border-dsfl-primary transition-all hover:bg-gray-800/30"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-white px-4 py-1 border border-gray-700 rounded-lg hover:border-dsfl-primary transition-all hover:bg-gray-800/30">
                Login
              </Link>
              <Link to="/signup" className="dsfl-btn relative overflow-hidden group">
                <span className="absolute inset-0 w-0 bg-dsfl-secondary group-hover:w-full transition-all duration-300 ease-out"></span>
                <span className="relative">Sign Up</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const isActive = window.location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center py-1 px-1 hover:text-dsfl-primary transition-all relative group ${isActive ? "text-dsfl-primary" : "text-gray-300"}`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-dsfl-primary transform scale-x-0 origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'group-hover:scale-x-100'}`}></span>
    </Link>
  );
};

export default Navbar;
