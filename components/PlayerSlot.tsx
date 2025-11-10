
import React from 'react';
import { Player } from '../types';
import { getCAColorClass } from '../utils';
import { PlusIcon, CloseIcon, StarIcon } from './icons';

interface PlayerSlotProps {
  player: Player | null;
  onSlotClick: () => void;
  onClearClick: (e: React.MouseEvent) => void;
}

const PlayerSlot: React.FC<PlayerSlotProps> = ({ player, onSlotClick, onClearClick }) => {
  if (player) {
    const nameColorClass = getCAColorClass(player.ca);
    return (
      <div className="group relative bg-slate-700/80 rounded p-2 text-left text-xs w-full h-14 hover:bg-slate-600 transition-colors duration-200 flex flex-col justify-between">
        <div onClick={onSlotClick} className="flex-grow flex flex-col justify-between cursor-pointer">
          <div className="flex items-start justify-between">
              <p className={`font-bold truncate text-sm leading-tight ${nameColorClass}`}>{player.name}</p>
              {player.pa >= 160 && <StarIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />}
          </div>
          <div className="flex justify-between items-baseline text-xs">
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400">AGE</span>
              <span className="font-bold text-slate-100">{player.age}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400">CA</span>
              <span className="font-bold text-slate-100">{player.ca}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-slate-400">PA</span>
              <span className="font-bold text-slate-100">{player.pa}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClearClick}
          className="absolute top-0 right-0 p-0.5 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all duration-200"
          aria-label="Remove player"
        >
          <CloseIcon className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSlotClick}
      className="w-full h-14 flex items-center justify-center bg-slate-800/50 border-2 border-dashed border-slate-600 rounded hover:bg-slate-700/50 hover:border-slate-500 transition-colors duration-200"
    >
      <PlusIcon className="w-4 h-4 text-slate-400" />
    </button>
  );
};

export default PlayerSlot;
