
import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { CloseIcon } from './icons';

interface PlayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, 'id'>) => void;
  playerToEdit: Player | null;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ isOpen, onClose, onSave, playerToEdit }) => {
  const defaultPlayerState = {
    name: '',
    age: '',
    ca: '',
    pa: '',
  };
  const [player, setPlayer] = useState(defaultPlayerState);

  useEffect(() => {
    if (isOpen) {
        if (playerToEdit) {
          setPlayer({
              name: playerToEdit.name,
              age: String(playerToEdit.age),
              ca: String(playerToEdit.ca),
              pa: String(playerToEdit.pa),
          });
        } else {
          setPlayer(defaultPlayerState);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
      if (name === 'name') {
          setPlayer(prev => ({ ...prev, [name]: value }));
      } else {
          if (value === '') {
              setPlayer(prev => ({ ...prev, [name]: '' }));
          } else {
              let numValue = parseInt(value, 10);
              if (!isNaN(numValue)) {
                  if (name === 'ca' || name === 'pa') {
                      numValue = Math.max(1, Math.min(200, numValue));
                  } else if (name === 'age') {
                      numValue = Math.max(15, Math.min(50, numValue));
                  }
                  setPlayer(prev => ({ ...prev, [name]: String(numValue) }));
              }
          }
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player.name.trim() === '') {
        alert("Player name cannot be empty.");
        return;
    }
    if (player.age === '' || player.ca === '' || player.pa === '') {
        alert("Please ensure all numeric fields are filled.");
        return;
    }
    const finalPlayer = {
        name: player.name,
        age: Number(player.age),
        ca: Number(player.ca),
        pa: Number(player.pa),
    };
    onSave(finalPlayer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-100">{playerToEdit ? 'Edit Player' : 'Add Player'}</h2>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
              <CloseIcon />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">Player Name</label>
              <input type="text" name="name" id="name" value={player.name} onChange={handleChange} required className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-white p-2" />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-300">Age</label>
              <input type="number" name="age" id="age" value={player.age} onChange={handleChange} required min="15" max="50" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-white p-2" />
            </div>
            <div>
              <label htmlFor="ca" className="block text-sm font-medium text-slate-300">Current Ability (CA)</label>
              <input type="number" name="ca" id="ca" value={player.ca} onChange={handleChange} required min="1" max="200" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-white p-2" />
            </div>
            <div>
              <label htmlFor="pa" className="block text-sm font-medium text-slate-300">Potential Ability (PA)</label>
              <input type="number" name="pa" id="pa" value={player.pa} onChange={handleChange} required min="1" max="200" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-white p-2" />
            </div>
          </div>
          <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors">Save Player</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerForm;
