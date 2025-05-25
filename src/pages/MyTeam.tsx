
import Navbar from "@/components/Navbar";
import TeamCreation from "@/components/TeamCreation";
import RouteGuard from "@/components/RouteGuard";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const MyTeam = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { userProfile, loading } = useAuth();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dsfl-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dsfl-primary"></div>
      </div>
    );
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-dsfl-dark">
        <Navbar />
        <div className="pt-24 pb-10 px-4">
          <div className="dsfl-container">
            <h1 className={`text-3xl font-bold mb-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Hi, {userProfile?.name || 'Player'}! Welcome to My Team
            </h1>
            <p className={`text-gray-400 mb-6 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Build your dream team by selecting players from the available roster.
            </p>
            <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <TeamCreation />
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
};

export default MyTeam;
