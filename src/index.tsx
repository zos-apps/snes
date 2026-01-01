import { useState, useRef, useCallback } from 'react';

interface SNESProps {
  onClose: () => void;
}

interface Game {
  id: string;
  name: string;
  icon: string;
  year: string;
  genre: string;
}

const CLASSIC_GAMES: Game[] = [
  { id: 'smw', name: 'Super Mario World', icon: '🍄', year: '1990', genre: 'Platformer' },
  { id: 'zelda', name: 'A Link to the Past', icon: '🗡️', year: '1991', genre: 'Adventure' },
  { id: 'metroid', name: 'Super Metroid', icon: '🚀', year: '1994', genre: 'Action' },
  { id: 'chrono', name: 'Chrono Trigger', icon: '⏰', year: '1995', genre: 'RPG' },
  { id: 'ff6', name: 'Final Fantasy VI', icon: '⚔️', year: '1994', genre: 'RPG' },
  { id: 'dkc', name: 'Donkey Kong Country', icon: '🦍', year: '1994', genre: 'Platformer' },
  { id: 'earthbound', name: 'EarthBound', icon: '👽', year: '1994', genre: 'RPG' },
  { id: 'sf2', name: 'Street Fighter II', icon: '🥊', year: '1992', genre: 'Fighting' },
  { id: 'mariokart', name: 'Super Mario Kart', icon: '🏎️', year: '1992', genre: 'Racing' },
  { id: 'starfox', name: 'Star Fox', icon: '🦊', year: '1993', genre: 'Shooter' },
  { id: 'contra', name: 'Contra III', icon: '🔫', year: '1992', genre: 'Action' },
  { id: 'megamanx', name: 'Mega Man X', icon: '🤖', year: '1993', genre: 'Action' },
];

const SNES: React.FC<SNESProps> = ({ onClose: _onClose }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [romLoaded, setRomLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith('.sfc') || file.name.endsWith('.smc'))) {
      setRomLoaded(true);
      setSelectedGame({
        id: 'custom',
        name: file.name.replace(/\.(sfc|smc)$/, ''),
        icon: '🎮',
        year: 'Custom',
        genre: 'ROM',
      });
    }
  }, []);

  const startGame = useCallback(() => {
    if (selectedGame || romLoaded) {
      setIsPlaying(true);
    }
  }, [selectedGame, romLoaded]);

  if (isPlaying) {
    return (
      <div className="h-full bg-black flex flex-col">
        {/* Emulator container */}
        <div className="flex-1 flex items-center justify-center bg-[#1a1a2e] relative">
          {/* CRT effect overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)',
          }} />
          
          {/* Game screen */}
          <div className="w-[512px] h-[448px] bg-black rounded-lg overflow-hidden border-4 border-gray-700 shadow-2xl relative">
            {/* EmulatorJS would load here */}
            <iframe
              src="https://www.retrogames.cc/embed/44397-super-mario-world-usa.html"
              className="w-full h-full border-0"
              allow="autoplay; fullscreen"
              title="SNES Emulator"
            />
          </div>
        </div>
        
        {/* Controls bar */}
        <div className="h-16 bg-gray-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-bold"
            >
              ⏹ Stop
            </button>
            <span className="text-gray-400">{selectedGame?.name}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Controls: Arrow Keys | Z/X = B/A | Enter = Start | Shift = Select</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-900 via-purple-950 to-black">
      {/* Header */}
      <div className="p-4 text-center border-b border-purple-700/30">
        <div className="text-4xl mb-2">🎮</div>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Super Nintendo
        </h1>
        <p className="text-purple-300/60 text-sm mt-1">16-bit classics, right in your browser</p>
      </div>

      {/* Game grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-3">
          {CLASSIC_GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game)}
              className={`
                p-4 rounded-lg text-left transition-all
                ${selectedGame?.id === game.id 
                  ? 'bg-purple-600 ring-2 ring-purple-400' 
                  : 'bg-purple-900/50 hover:bg-purple-800/50'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{game.icon}</span>
                <div>
                  <div className="font-bold text-white">{game.name}</div>
                  <div className="text-xs text-purple-300/60">{game.year} • {game.genre}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="p-4 bg-black/50 border-t border-purple-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".sfc,.smc"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white rounded flex items-center gap-2"
            >
              📂 Load ROM
            </button>
            {romLoaded && <span className="text-green-400 text-sm">ROM loaded!</span>}
          </div>
          
          <button
            onClick={startGame}
            disabled={!selectedGame && !romLoaded}
            className={`
              px-8 py-3 rounded-lg font-bold text-lg transition-all
              ${selectedGame || romLoaded
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            ▶️ Start Game
          </button>
        </div>
        
        <div className="mt-3 text-center text-xs text-purple-400/40">
          Load your own legally obtained ROM files or select a classic to play
        </div>
      </div>
    </div>
  );
};

export default SNES;
