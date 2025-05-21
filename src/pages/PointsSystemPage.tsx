
import Navbar from "@/components/Navbar";
import PointsSystem from "@/components/PointsSystem";

const PointsSystemPage = () => {
  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <div className="py-10">
        <div className="dsfl-container">
          <h1 className="text-3xl font-bold mb-6">Points System</h1>
          <PointsSystem />
        </div>
      </div>
    </div>
  );
};

export default PointsSystemPage;
