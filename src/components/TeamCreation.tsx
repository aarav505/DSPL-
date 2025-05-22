
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Position = "GK" | "DEF" | "MID" | "FWD";

type Player = {
  id: number;
  name: string;
  position: Position;
  price: number;
  team: string;
  selected: boolean;
};

const TeamCreation = () => {
  const [formation, setFormation] = useState("3-4-3");
  const [budget, setBudget] = useState(1000);
  const [points, setPoints] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('Players')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Players data:", data);
        // Convert the data to our Player type and mark all as unselected initially
        const formattedPlayers = data.map((player: any) => ({
          ...player,
          selected: false,
        }));
        
        setPlayers(formattedPlayers);
      }
    } catch (error: any) {
      console.error('Error fetching players:', error.message);
      toast({
        title: "Error",
        description: "Failed to load players. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = (player: Player) => {
    if (selectedPlayers.length >= 11) {
      toast({
        title: "Team full",
        description: "You can only select 11 players for your team",
        variant: "destructive",
      });
      return;
    }

    // Check if player fits in budget
    if (player.price > budget) {
      toast({
        title: "Insufficient budget",
        description: "You don't have enough budget to add this player",
        variant: "destructive",
      });
      return;
    }

    const updatedPlayers = players.map(p => 
      p.id === player.id ? { ...p, selected: true } : p
    );
    setPlayers(updatedPlayers);
    setSelectedPlayers([...selectedPlayers, player]);
    setBudget(budget - player.price);
  };

  const handleRemovePlayer = (player: Player) => {
    const updatedSelectedPlayers = selectedPlayers.filter(p => p.id !== player.id);
    const updatedPlayers = players.map(p => 
      p.id === player.id ? { ...p, selected: false } : p
    );
    setPlayers(updatedPlayers);
    setSelectedPlayers(updatedSelectedPlayers);
    setBudget(budget + player.price);
  };

  const handleSaveTeam = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your team",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlayers.length !== 11) {
      toast({
        title: "Team incomplete",
        description: "You need to select exactly 11 players for your team",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Team saved",
      description: "Your team has been saved successfully",
    });
  };

  const filteredPlayers = searchTerm
    ? players.filter(player => 
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.team.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : players;

  return (
    <section className="py-10">
      <div className="dsfl-container">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Your Team</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar */}
          <div className="flex flex-col gap-4">
            <div className="dsfl-card">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                  Statistics
                </div>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M15 3v18"></path><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v18"></path></svg>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-800 p-4 rounded-md">
                  <div className="font-bold">Balance</div>
                  <div className="text-2xl font-bold">₹{budget}</div>
                  <div className="text-xs text-gray-400">Amount of dascoin left</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-md">
                  <div className="font-bold">Points</div>
                  <div className="text-2xl font-bold">{points}</div>
                  <div className="text-xs text-gray-400">Points Earned</div>
                </div>
              </div>
            </div>
            
            <div className="dsfl-card">
              <div className="font-semibold text-lg mb-3">Formations</div>
              <div>
                <div className="mb-2 text-sm text-gray-400">Formation</div>
                <select 
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-dsfl-primary"
                  value={formation}
                  onChange={(e) => setFormation(e.target.value)}
                >
                  <option value="3-4-3">3-4-3</option>
                  <option value="4-3-3">4-3-3</option>
                  <option value="4-4-2">4-4-2</option>
                  <option value="5-3-2">5-3-2</option>
                </select>
              </div>
            </div>

            <div className="dsfl-card">
              <h3 className="text-lg font-semibold mb-3">Selected Players ({selectedPlayers.length}/11)</h3>
              {selectedPlayers.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {selectedPlayers.map(player => (
                    <div key={player.id} className="flex justify-between items-center p-2 bg-gray-800 rounded-md">
                      <div>
                        <span className="font-semibold">{player.name}</span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{player.position}</span>
                          <span>•</span>
                          <span>{player.team}</span>
                          <span>•</span>
                          <span>₹{player.price}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemovePlayer(player)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  No players selected yet
                </div>
              )}
            </div>
          </div>
          
          {/* Center field */}
          <div className="w-full aspect-[4/5] bg-gradient-to-b from-dsfl-field to-dsfl-fieldDark rounded-xl overflow-hidden relative border border-gray-700">
            <div className="absolute inset-0">
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 transform -translate-x-1/2"></div>
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 border-[1px] border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              
              {/* Goal areas */}
              <div className="absolute top-0 left-1/2 w-32 h-12 border-b-[1px] border-l-[1px] border-r-[1px] border-white/20 transform -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-32 h-12 border-t-[1px] border-l-[1px] border-r-[1px] border-white/20 transform -translate-x-1/2"></div>
            </div>
            
            {/* Player positions based on formation */}
            <div className="absolute inset-0 flex flex-col">
              {/* GK */}
              <div className="h-1/5 flex justify-center items-center">
                <div className="player-slot">
                  <div className="text-xs text-center">GK</div>
                </div>
              </div>
              
              {/* DEF */}
              <div className="h-1/5 flex justify-evenly items-center">
                {Array.from({ length: parseInt(formation.split('-')[0]) }).map((_, i) => (
                  <div key={`def-${i}`} className="player-slot">
                    <div className="text-xs text-center">DEF</div>
                  </div>
                ))}
              </div>
              
              {/* MID */}
              <div className="h-1/5 flex justify-evenly items-center">
                {Array.from({ length: parseInt(formation.split('-')[1]) }).map((_, i) => (
                  <div key={`mid-${i}`} className="player-slot">
                    <div className="text-xs text-center">MID</div>
                  </div>
                ))}
              </div>
              
              {/* FWD */}
              <div className="h-1/5 flex justify-evenly items-center">
                {Array.from({ length: parseInt(formation.split('-')[2]) }).map((_, i) => (
                  <div key={`fwd-${i}`} className="player-slot">
                    <div className="text-xs text-center">FWD</div>
                  </div>
                ))}
              </div>
              
              {/* Empty space at bottom */}
              <div className="h-1/5"></div>
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <div className="dsfl-card">
              <h3 className="text-lg font-semibold mb-3">Captain</h3>
              <button 
                className="dsfl-btn w-full"
                disabled={selectedPlayers.length === 0}
              >
                Choose Captain
              </button>
            </div>
            
            <div className="dsfl-card">
              <h3 className="text-lg font-semibold mb-3">Transfers</h3>
              <div className="bg-dsfl-primary/20 text-white p-3 rounded-md">
                You have 2 free transfers available
              </div>
            </div>
            
            <div className="mt-auto dsfl-card">
              <button 
                onClick={handleSaveTeam}
                className="dsfl-btn w-full"
                disabled={selectedPlayers.length === 0}
              >
                Save Team
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 dsfl-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Available Players</h3>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search players..." 
                className="pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-dsfl-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dsfl-primary"></div>
              </div>
            ) : filteredPlayers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell>{player.team}</TableCell>
                      <TableCell>₹{player.price}</TableCell>
                      <TableCell>
                        {player.selected ? (
                          <button 
                            onClick={() => handleRemovePlayer(player)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold"
                          >
                            Remove
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleAddPlayer(player)}
                            className="px-3 py-1 bg-dsfl-primary text-black rounded text-xs font-bold"
                          >
                            Add
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-400">
                {searchTerm ? "No players match your search" : "No players available"}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCreation;
