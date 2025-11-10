
export interface Player {
  id: string;
  name: string;
  age: number;
  ca: number;
  pa: number;
}

export interface PositionSlot {
  players: (Player | null)[];
  role: string;
}

export type Formation = Record<string, PositionSlot>;

export type Squad = Record<string, Formation>; // Keyed by formation name

export type Squads = Record<string, Squad>; // Keyed by squad name

export interface EditingSlot {
    position: string;
    index: number;
}

export interface DraggedItem {
    position: string;
    index: number;
}

export interface DropTarget {
    position: string;
    index: number;
}
