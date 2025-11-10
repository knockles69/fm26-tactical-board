
import React from 'react';
import { Formation, Player } from '../types';
import { getCAColorClass } from '../utils';

interface SquadListViewProps {
  formation: Formation;
  positionLabels: Record<string, { label: string }>;
}

const PlayerListItem: React.FC<{ player: Player & { displayPosition: string } }> = ({ player }) => {
    const nameColorClass = getCAColorClass(player.ca);
    return (
        <li className="flex justify-between items-center text-sm py-1.5 px-2 rounded hover:bg-slate-700/50">
            <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-400 w-8">{player.displayPosition}</span>
                <span className={nameColorClass}>{player.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-300">
                <span>Age: {player.age}</span>
                <span>CA: {player.ca}</span>
                <span>PA: {player.pa}</span>
            </div>
        </li>
    );
};

const ListSection: React.FC<{ title: string; players: (Player & { displayPosition: string })[] }> = ({ title, players }) => {
    if (players.length === 0) return null;
    return (
        <div>
            <h3 className="text-lg font-bold text-amber-400 border-b border-slate-700 pb-2 mb-2">{title}</h3>
            <ul className="space-y-1">
                {players.map(p => <PlayerListItem key={p.id} player={p} />)}
            </ul>
        </div>
    );
};

const SquadListView: React.FC<SquadListViewProps> = ({ formation, positionLabels }) => {
    const mainEleven: (Player & { displayPosition: string })[] = [];
    const subs: (Player & { displayPosition: string })[] = [];
    const youthOthers: (Player & { displayPosition: string })[] = [];

    Object.keys(positionLabels).forEach((pos) => {
        if (formation[pos]) {
            const { players } = formation[pos];
            if (players[0]) {
                mainEleven.push({ ...players[0], displayPosition: positionLabels[pos].label });
            }
            if (players.length > 1 && players[1]) {
                subs.push({ ...players[1], displayPosition: positionLabels[pos].label });
            }
            if (players.length > 2 && players[2]) {
                youthOthers.push({ ...players[2], displayPosition: positionLabels[pos].label });
            }
        }
    });

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 space-y-6">
            <ListSection title="Main Eleven" players={mainEleven} />
            <ListSection title="Subs" players={subs} />
            <ListSection title="Youth/Others" players={youthOthers} />
        </div>
    );
};

export default SquadListView;
