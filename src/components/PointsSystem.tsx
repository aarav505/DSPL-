
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PointsSystem = () => {
  return (
    <section className="py-10">
      <div className="dsfl-container">
        <h2 className="text-3xl font-bold mb-6 text-center">Points System</h2>
        
        <div className="space-y-8">
          <div className="dsfl-card">
            <h3 className="text-xl font-semibold mb-4">Overall Scoring</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game Played</TableHead>
                  <TableHead>Yellow Card</TableHead>
                  <TableHead>Red Card</TableHead>
                  <TableHead>Bonus (according to performance)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">+2</TableCell>
                  <TableCell>-1</TableCell>
                  <TableCell>-3</TableCell>
                  <TableCell>+1/+2/+3</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="dsfl-card">
            <h3 className="text-xl font-semibold mb-4">Position Based Scoring</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Position</TableHead>
                  <TableHead>Clean Sheet</TableHead>
                  <TableHead>Assists</TableHead>
                  <TableHead>2 Goals Conceded</TableHead>
                  <TableHead>Goal Scored</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Goalkeeper</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>-1</TableCell>
                  <TableCell>7</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Defender</TableCell>
                  <TableCell>4</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>-1</TableCell>
                  <TableCell>6</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Midfielder</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Attacker</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>4</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PointsSystem;
