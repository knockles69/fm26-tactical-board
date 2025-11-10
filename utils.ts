
export const getCAColorClass = (ca: number): string => {
    if (ca >= 160) return 'text-yellow-400'; // Golden
    if (ca >= 140) return 'text-green-400';
    if (ca >= 120) return 'text-slate-100'; // White
    if (ca >= 100) return 'text-orange-400';
    if (ca >= 1) return 'text-red-500';
    return 'text-slate-100'; // Default
};
