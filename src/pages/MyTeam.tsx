
import Navbar from "@/components/Navbar";
import TeamCreation from "@/components/TeamCreation";

const MyTeam = () => {
  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <div className="py-10">
        <div className="dsfl-container">
          <h1 className="text-3xl font-bold mb-6">My Team</h1>
          <TeamCreation />
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
