
import Hero from "@/components/Hero";
import TeamCreation from "@/components/TeamCreation";
import PointsSystem from "@/components/PointsSystem";
import Leaderboard from "@/components/Leaderboard";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <Hero />
      <TeamCreation />
      <PointsSystem />
      <Leaderboard />
      <footer className="bg-dsfl-darkblue border-t border-gray-800 py-6">
        <div className="dsfl-container text-center">
          <p className="text-gray-400 text-sm">© 2025 DSFL - Doon School Fantasy League. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-2">dsfl.doonschool.com/news</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
