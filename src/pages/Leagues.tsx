
import Navbar from "@/components/Navbar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Leagues = () => {
  const leagueData = [
    {
      name: "Main School League",
      participants: 45,
      leader: "Vikram Aditya",
      yourRank: 12
    },
    {
      name: "Jaipur House League",
      participants: 18,
      leader: "Aryan Mehta",
      yourRank: 3
    },
    {
      name: "Batch of 2025",
      participants: 24,
      leader: "Kabir Singh",
      yourRank: 7
    }
  ];

  return (
    <div className="min-h-screen bg-dsfl-dark">
      <Navbar />
      <div className="py-10">
        <div className="dsfl-container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Leagues</h1>
            <button className="dsfl-btn">Create League</button>
          </div>
          
          <div className="dsfl-card mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Leagues</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>League Name</TableHead>
                  <TableHead className="text-right">Participants</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead className="text-right">Your Rank</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leagueData.map((league) => (
                  <TableRow key={league.name}>
                    <TableCell className="font-medium">{league.name}</TableCell>
                    <TableCell className="text-right">{league.participants}</TableCell>
                    <TableCell>{league.leader}</TableCell>
                    <TableCell className="text-right">{league.yourRank}</TableCell>
                    <TableCell className="text-right">
                      <button className="text-dsfl-primary hover:underline">View</button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="dsfl-card">
            <h2 className="text-xl font-semibold mb-4">Join a League</h2>
            <div className="flex gap-4">
              <input 
                type="text" 
                placeholder="Enter league code" 
                className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-dsfl-primary"
              />
              <button className="dsfl-btn">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leagues;
