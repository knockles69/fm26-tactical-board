
import React, { useState, useEffect, useRef } from 'react';
import { Squads, Player, EditingSlot, DraggedItem, DropTarget } from './types';
import { SQUAD_NAMES, FORMATION_NAMES, FORMATIONS, INITIAL_SQUADS } from './constants';
import Tabs from './components/Tabs';
import PlayerForm from './components/PlayerForm';
import PositionBox from './components/PositionBox';
import SquadListView from './components/SquadListView';
import FormationLayout from './components/FormationLayout';
import TacticsMenu from './components/TacticsMenu';
import { SaveIcon } from './components/icons';

const App: React.FC = () => {
    const [squads, setSquads] = useState<Squads>(() => {
        try {
            const savedSquads = localStorage.getItem('fm2026_squads');
            return savedSquads ? JSON.parse(savedSquads) : INITIAL_SQUADS;
        } catch (error) {
            console.error("Failed to load squads from local storage", error);
            return INITIAL_SQUADS;
        }
    });

    const [activeSquad, setActiveSquad] = useState<string>(() => {
        try {
            const savedSquad = localStorage.getItem('fm2026_activeSquad');
            return savedSquad && SQUAD_NAMES.includes(savedSquad) ? savedSquad : 'Equipa A';
        } catch (error) {
            console.error("Failed to load active squad from local storage", error);
            return 'Equipa A';
        }
    });

    const [activeFormationName, setActiveFormationName] = useState<string>(() => {
        try {
            const savedFormation = localStorage.getItem('fm2026_activeFormation');
            return savedFormation && FORMATION_NAMES.includes(savedFormation) ? savedFormation : '4-3-3';
        } catch (error) {
            console.error("Failed to load active formation from local storage", error);
            return '4-3-3';
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
    const [editingSlot, setEditingSlot] = useState<EditingSlot | null>(null);
    const [showListView, setShowListView] = useState(false);
    const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const savingTimeoutRef = useRef<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (savingTimeoutRef.current) {
            clearTimeout(savingTimeoutRef.current);
        }
        setIsSaving(true);
        try {
            localStorage.setItem('fm2026_squads', JSON.stringify(squads));
        } catch (error) {
            console.error("Failed to save squads to local storage", error);
        }
        savingTimeoutRef.current = window.setTimeout(() => setIsSaving(false), 1500);

        return () => {
            if (savingTimeoutRef.current) {
                clearTimeout(savingTimeoutRef.current);
            }
        };
    }, [squads]);

    useEffect(() => {
        try {
            localStorage.setItem('fm2026_activeSquad', activeSquad);
        } catch (error) {
            console.error("Failed to save active squad to local storage", error);
        }
    }, [activeSquad]);

    useEffect(() => {
        try {
            localStorage.setItem('fm2026_activeFormation', activeFormationName);
        } catch (error) {
            console.error("Failed to save active formation to local storage", error);
        }
    }, [activeFormationName]);

    const handleSaveToFile = () => {
        try {
            const dataStr = JSON.stringify(squads, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `fm2026_squads_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to save data to file:", error);
            alert("Error: Could not save data to file.");
        }
    };

    const handleLoadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not valid text.");
                }
                const loadedSquads = JSON.parse(text);

                if (loadedSquads['Equipa A'] && loadedSquads['Equipa A']['4-3-3']) {
                    setSquads(loadedSquads);
                    alert("Squads loaded successfully!");
                } else {
                    throw new Error("Invalid squad file format.");
                }
            } catch (error) {
                console.error("Failed to load data from file:", error);
                alert("Error: Could not load data. The file may be corrupt or in the wrong format.");
            }
        };
        reader.readAsText(file);
        if(event.target) event.target.value = '';
    };

    const triggerLoadFile = () => {
        fileInputRef.current?.click();
    };

    const numberOfSlots = activeSquad === 'Equipa A' ? 3 : 2;

    const sortAndFillPosition = (players: (Player | null)[]): (Player | null)[] => {
        const validPlayers = players.filter((p): p is Player => p !== null);
        validPlayers.sort((a, b) => b.ca - a.ca);
        const finalSortedPlayers = Array(numberOfSlots).fill(null);
        for (let i = 0; i < Math.min(validPlayers.length, numberOfSlots); i++) {
            finalSortedPlayers[i] = validPlayers[i];
        }
        return finalSortedPlayers;
    };

    const handleTabClick = (squadName: string) => {
        setActiveSquad(squadName);
        setShowListView(false);
    };

    const handleOpenModal = (position: string, index: number, player: Player | null) => {
        setEditingSlot({ position, index });
        setPlayerToEdit(player);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSlot(null);
        setPlayerToEdit(null);
    };

    const handleSavePlayer = (playerData: Omit<Player, 'id'>) => {
        if (!editingSlot) return;
        const { position } = editingSlot;
        const newOrUpdatedPlayer: Player = { ...playerData, id: playerToEdit?.id || `p_${Date.now()}` };

        setSquads(prev => {
            const newSquads = JSON.parse(JSON.stringify(prev));
            const formation = newSquads[activeSquad][activeFormationName];
            const currentPlayers = formation[position].players;
            let playersToProcess;
            if (playerToEdit) {
                playersToProcess = currentPlayers.filter((p: Player | null) => p && p.id !== playerToEdit.id).concat(newOrUpdatedPlayer);
            } else {
                playersToProcess = currentPlayers.filter((p: Player | null) => p !== null).concat(newOrUpdatedPlayer);
            }
            formation[position].players = sortAndFillPosition(playersToProcess);
            return newSquads;
        });
        handleCloseModal();
    };

    const handleDeletePlayer = (position: string, index: number) => {
        setSquads(prev => {
            const newSquads = JSON.parse(JSON.stringify(prev));
            const formation = newSquads[activeSquad][activeFormationName];
            const positionPlayers = formation[position].players;
            positionPlayers[index] = null; // Set to null instead of splicing
            formation[position].players = sortAndFillPosition(positionPlayers);
            return newSquads;
        });
    };

    const handleRoleChange = (position: string, newRole: string) => {
        setSquads(prev => {
            const newSquads = JSON.parse(JSON.stringify(prev));
            newSquads[activeSquad][activeFormationName][position].role = newRole;
            return newSquads;
        });
    };

    const dndHandlers = {
        handleDragStart: (e: React.DragEvent, position: string, index: number) => {
            if (!squads[activeSquad][activeFormationName][position].players[index]) { e.preventDefault(); return; }
            setDraggedItem({ position, index });
            e.dataTransfer.effectAllowed = 'move';
        },
        handleDragOver: (e: React.DragEvent) => e.preventDefault(),
        handleDragEnter: (position: string, index: number) => {
            if (draggedItem && (draggedItem.position !== position || draggedItem.index !== index)) {
                setDropTarget({ position, index });
            }
        },
        handleDragLeave: () => setDropTarget(null),
        handleDrop: (targetPosition: string, targetIndex: number) => {
            if (!draggedItem) return;
            const { position: sourcePosition, index: sourceIndex } = draggedItem;
            if (sourcePosition === targetPosition && sourceIndex === targetIndex) return;

            setSquads(prev => {
                const newSquads = JSON.parse(JSON.stringify(prev));
                const formation = newSquads[activeSquad][activeFormationName];
                const sourcePlayer = formation[sourcePosition].players[sourceIndex];
                const targetPlayer = formation[targetPosition].players[targetIndex];
                
                formation[targetPosition].players[targetIndex] = sourcePlayer;
                formation[sourcePosition].players[sourceIndex] = targetPlayer;

                formation[targetPosition].players = sortAndFillPosition(formation[targetPosition].players);
                if (sourcePosition !== targetPosition) {
                    formation[sourcePosition].players = sortAndFillPosition(formation[sourcePosition].players);
                }
                return newSquads;
            });
        },
        handleDragEnd: () => {
            setDraggedItem(null);
            setDropTarget(null);
        },
        handleOpenModal,
        handleDeletePlayer,
    };

    const currentFormation = squads[activeSquad][activeFormationName];
    const currentFormationDef = FORMATIONS[activeFormationName];
    const pitchStyle = {
        backgroundImage: 'repeating-linear-gradient(to right, hsl(122, 39%, 30%) 0px, hsl(122, 39%, 30%) 40px, hsl(122, 39%, 32%) 40px, hsl(122, 39%, 32%) 80px)',
    };

    const positionBoxes = Object.keys(currentFormationDef).reduce((acc, posKey) => {
        acc[posKey] = (
            <PositionBox
                key={posKey}
                position={posKey}
                label={currentFormationDef[posKey].label}
                players={currentFormation[posKey].players}
                role={currentFormation[posKey].role}
                onRoleChange={(newRole) => handleRoleChange(posKey, newRole)}
                draggedItem={draggedItem}
                dropTarget={dropTarget}
                handlers={dndHandlers}
            />
        );
        return acc;
    }, {} as Record<string, React.ReactNode>);

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <header className="max-w-screen-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center border-b border-slate-700">
                    <Tabs squadNames={SQUAD_NAMES} activeSquad={activeSquad} onTabClick={handleTabClick} />
                    <div className="flex items-center space-x-2">
                        <input type="file" ref={fileInputRef} onChange={handleLoadFromFile} accept="application/json" className="hidden" />
                        <button
                            onClick={handleSaveToFile}
                            className="bg-slate-800/80 backdrop-blur-sm text-slate-200 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-600 transition-colors"
                            title="Save to File"
                        >
                            Save
                        </button>
                        <button
                            onClick={triggerLoadFile}
                            className="bg-slate-800/80 backdrop-blur-sm text-slate-200 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-600 transition-colors"
                            title="Load from File"
                        >
                            Load
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-screen-2xl mx-auto p-4 flex justify-center items-start">
                {showListView ? (
                    <div className="w-full max-w-2xl">
                        <button
                            onClick={() => setShowListView(false)}
                            className="mb-4 bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded transition-colors"
                        >
                            Back to Pitch View
                        </button>
                        <SquadListView formation={currentFormation} positionLabels={currentFormationDef} />
                    </div>
                ) : (
                    <div className="relative w-full max-w-5xl">
                        <div className="pitch aspect-[5/8] w-full rounded-lg shadow-2xl p-2 border-2 border-white/80" style={pitchStyle}>
                            {/* Field Markings */}
                            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/80 -translate-y-1/2 z-0" />
                            <div className="absolute top-1/2 left-1/2 w-[15%] aspect-square border-2 border-white/80 rounded-full -translate-x-1/2 -translate-y-1/2 z-0" />
                            <div className="absolute top-0 left-1/2 w-[44%] h-[16.5%] border-x-2 border-b-2 border-white/80 -translate-x-1/2 z-0" />
                            <div className="absolute top-0 left-1/2 w-[22%] h-[6%] border-x-2 border-b-2 border-white/80 -translate-x-1/2 z-0" />
                            <div className="absolute bottom-0 left-1/2 w-[44%] h-[16.5%] border-x-2 border-t-2 border-white/80 -translate-x-1/2 z-0" />
                            <div className="absolute bottom-0 left-1/2 w-[22%] h-[6%] border-x-2 border-t-2 border-white/80 -translate-x-1/2 z-0" />

                            <div className="absolute top-2 left-2 z-20">
                                <TacticsMenu activeFormation={activeFormationName} onSelectFormation={setActiveFormationName} />
                            </div>

                            <div className="absolute top-2 right-2 z-20 flex items-center space-x-2">
                                <button
                                    onClick={() => setShowListView(true)}
                                    className="bg-slate-800/80 backdrop-blur-sm text-slate-200 hover:bg-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-600 transition-colors"
                                    aria-label="Show Squad List"
                                >
                                    Squad List
                                </button>
                            </div>

                            <FormationLayout formationName={activeFormationName} positions={positionBoxes} />
                        </div>
                    </div>
                )}
            </main>

            <div className={`fixed bottom-4 right-4 bg-slate-800/90 text-slate-200 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-opacity duration-500 z-50 ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
                <SaveIcon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium">Autosaving...</span>
            </div>

            <PlayerForm isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSavePlayer} playerToEdit={playerToEdit} />
        </div>
    );
};

export default App;
