
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type LeaderboardEntry = {
  rank: number;
  name: string;
  house: string;
  points: number;
  lastWeek: number;
};

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Aryan Mehta", house: "Jaipur", points: 245, lastWeek: 32 },
  { rank: 2, name: "Kabir Singh", house: "Kashmir", points: 230, lastWeek: 28 },
  { rank: 3, name: "Vikram Aditya", house: "Hyderabad", points: 225, lastWeek: 24 },
  { rank: 4, name: "Rohan Kapoor", house: "Tata", points: 215, lastWeek: 37 },
  { rank: 5, name: "Dhruv Sharma", house: "Oberoi", points: 210, lastWeek: 18 },
];

const Leaderboard = () => {
  return (
    <section className="py-10">
      <div className="dsfl-container">
        <h2 className="text-3xl font-bold mb-6 text-center">Leaderboard</h2>
        
        <div className="dsfl-card">
          <div className="flex justify-end mb-4">
            <select className="bg-gray-800 border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-dsfl-primary">
              <option value="overall">Overall</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>House</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right w-24">Last Week</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((entry) => (
                <TableRow key={entry.rank} className={entry.rank === 1 ? "bg-dsfl-primary/20" : ""}>
                  <TableCell className="font-medium">
                    {entry.rank === 1 && (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-500 text-black rounded-full mr-2">
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      </span>
                    )}
                    {entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{entry.name}</div>
                  </TableCell>
                  <TableCell>{entry.house}</TableCell>
                  <TableCell className="text-right font-bold">{entry.points}</TableCell>
                  <TableCell className="text-right text-green-500">+{entry.lastWeek}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
