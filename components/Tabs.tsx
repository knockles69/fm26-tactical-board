
import React from 'react';

interface TabsProps {
  squadNames: string[];
  activeSquad: string;
  onTabClick: (squadName: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ squadNames, activeSquad, onTabClick }) => {
  return (
    <div>
      <nav className="-mb-px flex space-x-4 md:space-x-8" aria-label="Tabs">
        {squadNames.map((name) => (
          <button
            key={name}
            onClick={() => onTabClick(name)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${name === activeSquad
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
              }
            `}
          >
            {name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
