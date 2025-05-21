
import Navbar from "@/components/Navbar";
import Leaderboard from "@/components/Leaderboard";

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <div className="py-10">
        <div className="dsfl-container">
          <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
          <Leaderboard />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
