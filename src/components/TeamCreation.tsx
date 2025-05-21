
import { useState } from "react";

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

  // Simplified player data - in a real app, this would come from an API
  const [players, setPlayers] = useState<Player[]>([]);

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
              <button className="dsfl-btn w-full">Choose Captain</button>
            </div>
            
            <div className="dsfl-card">
              <h3 className="text-lg font-semibold mb-3">Transfers</h3>
              <div className="bg-dsfl-primary/20 text-white p-3 rounded-md">
                You have 2 free transfers available
              </div>
            </div>
            
            <div className="mt-auto dsfl-card">
              <button className="dsfl-btn w-full">Save Team</button>
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
              />
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-800">
                  <th className="p-2">Name</th>
                  <th className="p-2">Position</th>
                  <th className="p-2">Team</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Sample player data - would come from API */}
                <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-2">Aryan Singh</td>
                  <td className="p-2">FWD</td>
                  <td className="p-2">Jaipur</td>
                  <td className="p-2">₹120</td>
                  <td className="p-2">
                    <button className="px-3 py-1 bg-dsfl-primary text-black rounded text-xs font-bold">
                      Add
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-2">Rahul Kapoor</td>
                  <td className="p-2">MID</td>
                  <td className="p-2">Hyderabad</td>
                  <td className="p-2">₹90</td>
                  <td className="p-2">
                    <button className="px-3 py-1 bg-dsfl-primary text-black rounded text-xs font-bold">
                      Add
                    </button>
                  </td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-2">Vivaan Sharma</td>
                  <td className="p-2">DEF</td>
                  <td className="p-2">Kashmir</td>
                  <td className="p-2">₹80</td>
                  <td className="p-2">
                    <button className="px-3 py-1 bg-dsfl-primary text-black rounded text-xs font-bold">
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamCreation;
