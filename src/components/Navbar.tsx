
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-dsfl-darkblue border-b border-gray-800">
      <div className="dsfl-container flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
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
          <div className="text-[8px] text-gray-400 hidden sm:block">DOON SCHOOL FANTASY LEAGUE</div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/my-team">My Team</NavLink>
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/leagues">Leagues</NavLink>
          <NavLink to="/points-system">Points System</NavLink>
          <NavLink to="/news">News</NavLink>
        </div>
        
        <div className="flex items-center space-x-3">
          <Link to="/login" className="text-white px-4 py-1 border border-gray-700 rounded-lg hover:border-dsfl-primary transition-all">Login</Link>
          <Link to="/signup" className="dsfl-btn">Sign Up</Link>
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
      className={`flex items-center py-1 px-1 hover:text-dsfl-primary transition-all ${isActive ? "text-dsfl-primary border-b-2 border-dsfl-primary" : "text-gray-300"}`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
