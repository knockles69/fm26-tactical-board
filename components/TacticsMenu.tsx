
import React, { useState, useEffect, useRef } from 'react';
import { FORMATION_NAMES } from '../constants';

interface TacticsMenuProps {
    activeFormation: string;
    onSelectFormation: (formation: string) => void;
}

const TacticsMenu: React.FC<TacticsMenuProps> = ({ activeFormation, onSelectFormation }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (formation: string) => {
        onSelectFormation(formation);
        setIsOpen(false);
    };

    return (
        <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="z-20 bg-slate-800/80 backdrop-blur-sm text-slate-200 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-600 transition-colors"
            >
              Tactics
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 w-32 bg-slate-800 border border-slate-600 rounded-md shadow-lg z-30">
                    <ul className="py-1">
                        {FORMATION_NAMES.map(name => (
                            <li key={name}>
                                <button
                                    onClick={() => handleSelect(name)}
                                    className={`w-full text-left px-3 py-1.5 text-sm ${activeFormation === name ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                                >
                                    {name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TacticsMenu;
