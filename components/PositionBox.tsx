
import React, { useState, useEffect, useRef } from 'react';
import { Player, DraggedItem, DropTarget } from '../types';
import PlayerSlot from './PlayerSlot';

interface PositionBoxProps {
    position: string;
    label: string;
    role: string;
    players: (Player | null)[];
    draggedItem: DraggedItem | null;
    dropTarget: DropTarget | null;
    handlers: {
        handleDragStart: (e: React.DragEvent, position: string, index: number) => void;
        handleDragOver: (e: React.DragEvent) => void;
        handleDragEnter: (position: string, index: number) => void;
        handleDragLeave: () => void;
        handleDrop: (position: string, index: number) => void;
        handleDragEnd: () => void;
        handleOpenModal: (position: string, index: number, player: Player | null) => void;
        handleDeletePlayer: (position: string, index: number) => void;
    };
    onRoleChange: (newRole: string) => void;
}

const PositionBox: React.FC<PositionBoxProps> = ({ position, label, role, players, draggedItem, dropTarget, handlers, onRoleChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [roleValue, setRoleValue] = useState(role);
    const inputRef = useRef<HTMLInputElement>(null);
    const isTwoSlotView = players.length === 2;
    
    useEffect(() => {
        setRoleValue(role);
    }, [role]);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleSaveRole = () => {
        onRoleChange(roleValue);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveRole();
        } else if (e.key === 'Escape') {
            setRoleValue(role);
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-2 w-52 flex-shrink-0 shadow-lg border border-slate-700 h-56 flex flex-col">
            <h4 className="font-bold text-sm text-orange-400 mb-2 flex-shrink-0 h-5 flex items-center justify-center gap-2">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={roleValue}
                        onChange={(e) => setRoleValue(e.target.value)}
                        onBlur={handleSaveRole}
                        onKeyDown={handleKeyDown}
                        className="bg-slate-700 text-orange-400 text-center w-full text-sm font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
                    />
                ) : (
                    <>
                        <span onDoubleClick={() => setIsEditing(true)} className="cursor-pointer truncate" title="Double-click to edit role">
                            {label}{role && ` - ${role}`}
                        </span>
                        {!role && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-xs font-semibold text-amber-400 bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                                title="Add Role"
                            >
                                Add Role
                            </button>
                        )}
                    </>
                )}
            </h4>
            <div className={`flex-grow flex flex-col ${isTwoSlotView ? 'justify-center gap-y-2' : 'justify-around'}`}>
                {players.map((player, index) => {
                    const isDragging = draggedItem?.position === position && draggedItem.index === index;
                    const isDropTarget = dropTarget?.position === position && dropTarget.index === index;

                    return (
                        <div
                            key={index}
                            draggable={!!player}
                            onDragStart={(e) => handlers.handleDragStart(e, position, index)}
                            onDragOver={handlers.handleDragOver}
                            onDragEnter={() => handlers.handleDragEnter(position, index)}
                            onDragLeave={handlers.handleDragLeave}
                            onDrop={() => handlers.handleDrop(position, index)}
                            onDragEnd={handlers.handleDragEnd}
                            className={`
                                transition-all duration-200 rounded
                                ${player ? 'cursor-grab' : ''}
                                ${isDragging ? 'opacity-30' : 'opacity-100'}
                                ${isDropTarget ? 'ring-2 ring-amber-500' : ''}
                            `}
                        >
                            <PlayerSlot
                                player={player}
                                onSlotClick={() => handlers.handleOpenModal(position, index, player)}
                                onClearClick={(e) => {
                                    e.stopPropagation();
                                    handlers.handleDeletePlayer(position, index);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PositionBox;
