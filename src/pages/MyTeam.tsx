
import Navbar from "@/components/Navbar";
import TeamCreation from "@/components/TeamCreation";
import { useState, useEffect } from "react";

const MyTeam = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <div className="pt-24 pb-10 px-4">
        <div className="dsfl-container">
          <h1 className={`text-3xl font-bold mb-2 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>My Team</h1>
          <p className={`text-gray-400 mb-6 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Build your dream team by selecting players from the available roster.
          </p>
          <div className={`transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <TeamCreation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
