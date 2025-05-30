import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import TeamField from './TeamField';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authService } from '@/lib/auth';

type Position = "GK" | "DEF" | "MID" | "FWD";

interface Player {
  id: number;
  name: string;
  position: Position;
  price: number;
  team: string;
  selected: boolean;
  house?: string;
  isCaptain?: boolean;
}

// Function to map database positions to our TypeScript types
const mapPosition = (dbPosition: string): Position => {
  switch (dbPosition) {
    case 'Goalkeeper':
      return 'GK';
    case 'Defender':
      return 'DEF';
    case 'Midfielder':
      return 'MID';
    case 'Forward':
      return 'FWD';
    default:
      console.warn(`Unknown position: ${dbPosition}, defaulting to MID`);
      return 'MID';
  }
};

const TeamCreation = () => {
  const [formation, setFormation] = useState("4-3-3");
  const [budget, setBudget] = useState(1000);
  const [points, setPoints] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [captain, setCaptain] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, userProfile, refreshUserProfile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchPlayersAndUserTeam();
    }
  }, [user]);

  const fetchPlayersAndUserTeam = async () => {
    try {
      setLoading(true);
      
      const { data: playersData, error: playersError } = await supabase
        .from('Players')
        .select('*');

      if (playersError) {
        console.error('Error fetching players:', playersError);
        throw playersError;
      }

      const { data: userTeamData, error: teamError } = await supabase
        .from('user_teams')
        .select('player_id')
        .eq('user_id', user?.id);

      if (teamError) {
        console.error('Error fetching user team:', teamError);
      }

      const userPlayerIds = userTeamData?.map(team => team.player_id) || [];

      if (playersData) {
        console.log("Players data:", playersData);
        const formattedPlayers = playersData.map((player: any) => ({
          ...player,
          position: mapPosition(player.position), // Map the position here
          selected: userPlayerIds.includes(player.id),
        }));
        
        setPlayers(formattedPlayers);
        
        const selectedPlayersData = formattedPlayers.filter((p: Player) => p.selected);
        setSelectedPlayers(selectedPlayersData);
        
        if (userProfile) {
          setBudget(userProfile.budget || 1000);
          setPoints(userProfile.fantasy_points || 0);
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormationLimits = () => {
    const parts = formation.split('-').map(Number);
    return {
      GK: 1,
      DEF: parts[0] || 4,
      MID: parts[1] || 3,
      FWD: parts[2] || 3
    };
  };

  const canAddPlayer = (player: Player) => {
    if (selectedPlayers.length >= 11) return false;
    if (player.price > budget) return false;
    
    const limits = getFormationLimits();
    const currentCount = selectedPlayers.filter(p => p.position === player.position).length;
    return currentCount < limits[player.position];
  };

  const handleAddPlayer = async (player: Player) => {
    if (!canAddPlayer(player)) {
      const limits = getFormationLimits();
      const currentCount = selectedPlayers.filter(p => p.position === player.position).length;
      
      if (currentCount >= limits[player.position]) {
        toast({
          title: "Position limit reached",
          description: `Formation ${formation} allows only ${limits[player.position]} ${player.position} players`,
          variant: "destructive",
        });
        return;
      }
      
      if (selectedPlayers.length >= 11) {
        toast({
          title: "Team full",
          description: "You can only select 11 players for your team",
          variant: "destructive",
        });
        return;
      }

      if (player.price > budget) {
        toast({
          title: "Insufficient budget",
          description: "You don't have enough budget to add this player",
          variant: "destructive",
        });
        return;
      }
    }

    await savePlayerToTeam(player.id);
    
    const newBudget = budget - player.price;
    await updateUserBudget(newBudget);

    const updatedPlayers = players.map(p => 
      p.id === player.id ? { ...p, selected: true } : p
    );
    setPlayers(updatedPlayers);
    setSelectedPlayers([...selectedPlayers, player]);
    setBudget(newBudget);

    toast({
      title: "Player added",
      description: `${player.name} has been added to your team`,
    });
  };

  const handleRemovePlayer = async (player: Player) => {
    await removePlayerFromTeam(player.id);
    
    const newBudget = budget + player.price;
    await updateUserBudget(newBudget);

    if (captain?.id === player.id) {
      setCaptain(null);
    }

    const updatedSelectedPlayers = selectedPlayers.filter(p => p.id !== player.id);
    const updatedPlayers = players.map(p => 
      p.id === player.id ? { ...p, selected: false } : p
    );
    setPlayers(updatedPlayers);
    setSelectedPlayers(updatedSelectedPlayers);
    setBudget(newBudget);

    toast({
      title: "Player removed",
      description: `${player.name} has been removed from your team`,
    });
  };

  const handleSetCaptain = (player: Player) => {
    setCaptain(player);
    toast({
      title: "Captain set",
      description: `${player.name} is now your captain`,
    });
  };

  const savePlayerToTeam = async (playerId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_teams')
        .insert({
          user_id: user.id,
          player_id: playerId
        });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error saving player to team:', error);
      toast({
        title: "Error",
        description: "Failed to save player to team",
        variant: "destructive",
      });
    }
  };

  const removePlayerFromTeam = async (playerId: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_teams')
        .delete()
        .eq('user_id', user.id)
        .eq('player_id', playerId);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error removing player from team:', error);
      toast({
        title: "Error",
        description: "Failed to remove player from team",
        variant: "destructive",
      });
    }
  };

  const updateUserBudget = async (newBudget: number) => {
    if (!user) return;

    try {
      const success = await authService.updateUserProfile(user.id, { budget: newBudget });
      if (success) {
        await refreshUserProfile();
      } else {
        throw new Error('Failed to update budget');
      }
    } catch (error: any) {
      console.error('Error updating user budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive",
      });
    }
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

    if (!captain) {
      toast({
        title: "Captain not set",
        description: "Please select a captain for your team",
        variant: "destructive",
      });
      return;
    }

    const limits = getFormationLimits();
    const playerCounts = {
      GK: selectedPlayers.filter(p => p.position === 'GK').length,
      DEF: selectedPlayers.filter(p => p.position === 'DEF').length,
      MID: selectedPlayers.filter(p => p.position === 'MID').length,
      FWD: selectedPlayers.filter(p => p.position === 'FWD').length,
    };

    for (const [position, count] of Object.entries(playerCounts)) {
      if (count !== limits[position as Position]) {
        toast({
          title: "Invalid formation",
          description: `Formation ${formation} requires ${limits[position as Position]} ${position} players, but you have ${count}`,
          variant: "destructive",
        });
        return;
      }
    }

    try {
      // Start a transaction
      const { error: teamError } = await supabase
        .from('user_teams')
        .delete()
        .eq('user_id', user.id);

      if (teamError) {
        console.error('Error deleting existing team:', teamError);
        throw new Error('Failed to clear existing team');
      }

      // Insert new team
      const teamInserts = selectedPlayers.map(player => ({
        user_id: user.id,
        player_id: player.id,
        is_captain: player.id === captain.id
      }));

      const { error: insertError } = await supabase
        .from('user_teams')
        .insert(teamInserts);

      if (insertError) {
        console.error('Error inserting new team:', insertError);
        throw new Error('Failed to save new team');
      }

      // Update user profile with team status
      const { error: updateError } = await supabase
        .from('Users')
        .update({
          team_created: true,
          last_team_update: new Date().toISOString(),
          captain_id: captain.id
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        throw new Error('Failed to update user profile');
      }

      toast({
        title: "Team saved successfully",
        description: "Your team has been saved and is ready for the competition!",
      });

      // Refresh the user profile to get updated data
      await refreshUserProfile();
    } catch (error: any) {
      console.error('Error saving team:', error);
      toast({
        title: "Error saving team",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
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
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar */}
          <div className="flex flex-col gap-4">
            <div className="dsfl-card">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold flex items-center gap-2">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
                  Statistics
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
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
              <div className="font-semibold text-lg mb-3">Formation</div>
              <select 
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-dsfl-primary"
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
              >
                <option value="4-3-3">4-3-3</option>
                <option value="3-4-3">3-4-3</option>
                <option value="4-4-2">4-4-2</option>
                <option value="5-3-2">5-3-2</option>
                <option value="3-5-2">3-5-2</option>
              </select>
            </div>
          </div>
          
          {/* Center field - now spans 2 columns and is bigger */}
          <div className="lg:col-span-2">
            <TeamField 
              formation={formation}
              selectedPlayers={selectedPlayers}
              captain={captain}
              onRemovePlayer={handleRemovePlayer}
              onSetCaptain={handleSetCaptain}
            />
          </div>
          
          {/* Right sidebar */}
          <div className="flex flex-col gap-4">
            <div className="dsfl-card">
              <h3 className="text-lg font-semibold mb-3">Captain</h3>
              {captain ? (
                <div className="bg-yellow-400/20 p-3 rounded-md">
                  <div className="font-bold text-yellow-400">{captain.name}</div>
                  <div className="text-sm text-gray-300">{captain.position} - {captain.team}</div>
                </div>
              ) : (
                <div className="text-gray-400 text-center py-4">
                  Click on a player in the field to set as captain
                </div>
              )}
            </div>
            
            <div className="dsfl-card">
              <h3 className="text-lg font-semibold mb-3">Team Status</h3>
              <div className="space-y-2 text-sm">
                <div>Players: {selectedPlayers.length}/11</div>
                <div>GK: {selectedPlayers.filter(p => p.position === 'GK').length}/1</div>
                <div>DEF: {selectedPlayers.filter(p => p.position === 'DEF').length}/{getFormationLimits().DEF}</div>
                <div>MID: {selectedPlayers.filter(p => p.position === 'MID').length}/{getFormationLimits().MID}</div>
                <div>FWD: {selectedPlayers.filter(p => p.position === 'FWD').length}/{getFormationLimits().FWD}</div>
              </div>
            </div>
            
            <div className="mt-auto dsfl-card">
              <button 
                onClick={handleSaveTeam}
                className="dsfl-btn w-full"
                disabled={selectedPlayers.length !== 11}
              >
                Save Team
              </button>
            </div>
          </div>
        </div>
        
        {/* Available Players Table */}
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
                            className={`px-3 py-1 rounded text-xs font-bold ${
                              canAddPlayer(player) 
                                ? 'bg-dsfl-primary text-black' 
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!canAddPlayer(player)}
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
