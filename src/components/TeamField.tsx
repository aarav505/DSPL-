
import { useState } from "react";

type Position = "GK" | "DEF" | "MID" | "FWD";

type Player = {
  id: number;
  name: string;
  position: Position;
  price: number;
  team: string;
  selected: boolean;
  house?: string;
};

interface TeamFieldProps {
  formation: string;
  selectedPlayers: Player[];
  captain: Player | null;
  onRemovePlayer: (player: Player) => void;
  onSetCaptain: (player: Player) => void;
}

const TeamField = ({ formation, selectedPlayers, captain, onRemovePlayer, onSetCaptain }: TeamFieldProps) => {
  const [hoveredPlayer, setHoveredPlayer] = useState<Player | null>(null);

  const getFormationNumbers = () => {
    const parts = formation.split('-').map(Number);
    return {
      def: parts[0] || 3,
      mid: parts[1] || 4,
      fwd: parts[2] || 3
    };
  };

  const getPlayersByPosition = (position: Position) => {
    return selectedPlayers.filter(p => p.position === position);
  };

  const { def, mid, fwd } = getFormationNumbers();

  const PlayerSlot = ({ position, index, player }: { position: Position; index: number; player?: Player }) => (
    <div className="relative">
      <div 
        className={`w-20 h-20 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-200 ${
          player 
            ? `bg-dsfl-primary text-black hover:scale-110 ${captain?.id === player.id ? 'ring-4 ring-yellow-400' : ''}` 
            : 'bg-gray-600/50 text-gray-300'
        }`}
        onClick={() => player && onSetCaptain(player)}
        onMouseEnter={() => player && setHoveredPlayer(player)}
        onMouseLeave={() => setHoveredPlayer(null)}
      >
        {player ? (
          <>
            {captain?.id === player.id && <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full text-black text-xs flex items-center justify-center font-bold">C</div>}
            <span className="truncate px-1 text-center leading-tight">
              {player.name ? player.name.split(' ')[0] : 'Player'}
            </span>
          </>
        ) : (
          position
        )}
      </div>
      
      {hoveredPlayer?.id === player?.id && player && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 bg-black/90 text-white p-3 rounded-md text-sm whitespace-nowrap min-w-max">
          <div className="font-bold">{player.name}</div>
          <div>Position: {player.position}</div>
          <div>Team: {player.team}</div>
          <div>House: {player.house || 'Not specified'}</div>
          <div>Price: ₹{player.price}</div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onRemovePlayer(player);
            }}
            className="mt-2 bg-red-500 px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full aspect-[4/6] bg-gradient-to-b from-dsfl-field to-dsfl-fieldDark rounded-xl overflow-hidden relative border border-gray-700">
      {/* Field markings */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 transform -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 transform -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-[1px] border-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Goal areas */}
        <div className="absolute top-0 left-1/2 w-32 h-12 border-b-[1px] border-l-[1px] border-r-[1px] border-white/20 transform -translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-12 border-t-[1px] border-l-[1px] border-r-[1px] border-white/20 transform -translate-x-1/2"></div>
        
        {/* Corner arcs */}
        <div className="absolute top-0 left-0 w-8 h-8 border-r-[1px] border-b-[1px] border-white/20 rounded-br-full"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-l-[1px] border-b-[1px] border-white/20 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-r-[1px] border-t-[1px] border-white/20 rounded-tr-full"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-l-[1px] border-t-[1px] border-white/20 rounded-tl-full"></div>
      </div>
      
      {/* Player positions */}
      <div className="absolute inset-0 flex flex-col justify-between py-8">
        {/* Goalkeeper */}
        <div className="flex justify-center">
          <PlayerSlot 
            position="GK" 
            index={0} 
            player={getPlayersByPosition("GK")[0]} 
          />
        </div>
        
        {/* Defenders */}
        <div className="flex justify-evenly px-12">
          {Array.from({ length: def }).map((_, i) => (
            <PlayerSlot 
              key={`def-${i}`} 
              position="DEF" 
              index={i} 
              player={getPlayersByPosition("DEF")[i]} 
            />
          ))}
        </div>
        
        {/* Midfielders */}
        <div className="flex justify-evenly px-12">
          {Array.from({ length: mid }).map((_, i) => (
            <PlayerSlot 
              key={`mid-${i}`} 
              position="MID" 
              index={i} 
              player={getPlayersByPosition("MID")[i]} 
            />
          ))}
        </div>
        
        {/* Forwards */}
        <div className="flex justify-evenly px-12">
          {Array.from({ length: fwd }).map((_, i) => (
            <PlayerSlot 
              key={`fwd-${i}`} 
              position="FWD" 
              index={i} 
              player={getPlayersByPosition("FWD")[i]} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamField;
