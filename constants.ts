
import { Squads, Formation } from './types';

export const SQUAD_NAMES = ['Equipa A', 'Equipa B', 'Sub 23', 'Sub 19'];
export const FORMATION_NAMES = ['4-3-3', '4-2-4', '4-2-3-1'];

export const FORMATIONS: Record<string, Record<string, { label: string }>> = {
    '4-3-3': {
        ST:   { label: 'PL' },
        LW:   { label: 'EE' },
        RW:   { label: 'ED' },
        CM1:  { label: 'MC' },
        CM2:  { label: 'MC' },
        DM:   { label: 'MD' },
        LB:   { label: 'DE' },
        CB1:  { label: 'DC' },
        CB2:  { label: 'DC' },
        RB:   { label: 'DD' },
        GK:   { label: 'GR' },
    },
    '4-2-4': {
        CFD1: { label: 'PL' },
        CFD2: { label: 'PL' },
        LWMF: { label: 'EE' },
        RWMF: { label: 'ED' },
        DM1:  { label: 'MD' },
        DM2:  { label: 'MD' },
        FB1:  { label: 'DE' },
        CB1:  { label: 'DC' },
        CB2:  { label: 'DC' },
        FB2:  { label: 'DD' },
        GK:   { label: 'GR' },
    },
    '4-2-3-1': {
        ST:   { label: 'PL' },
        LW:   { label: 'EE' },
        RW:   { label: 'ED' },
        AM:   { label: 'MO' },
        DM1:  { label: 'MD' },
        DM2:  { label: 'MD' },
        LB:   { label: 'DE' },
        CB1:  { label: 'DC' },
        CB2:  { label: 'DC' },
        RB:   { label: 'DD' },
        GK:   { label: 'GR' },
    }
};

const createEmptyFormation = (formationName: string, slots: number): Formation => {
    const formation: Formation = {};
    const formationPositions = FORMATIONS[formationName];
    Object.keys(formationPositions).forEach(pos => {
        formation[pos] = {
            players: Array(slots).fill(null),
            role: ''
        };
    });
    return formation;
};

export const INITIAL_SQUADS: Squads = {
    'Equipa A': {
        '4-3-3': createEmptyFormation('4-3-3', 3),
        '4-2-4': createEmptyFormation('4-2-4', 3),
        '4-2-3-1': createEmptyFormation('4-2-3-1', 3),
    },
    'Equipa B': {
        '4-3-3': createEmptyFormation('4-3-3', 2),
        '4-2-4': createEmptyFormation('4-2-4', 2),
        '4-2-3-1': createEmptyFormation('4-2-3-1', 2),
    },
    'Sub 23': {
        '4-3-3': createEmptyFormation('4-3-3', 2),
        '4-2-4': createEmptyFormation('4-2-4', 2),
        '4-2-3-1': createEmptyFormation('4-2-3-1', 2),
    },
    'Sub 19': {
        '4-3-3': createEmptyFormation('4-3-3', 2),
        '4-2-4': createEmptyFormation('4-2-4', 2),
        '4-2-3-1': createEmptyFormation('4-2-3-1', 2),
    },
};
