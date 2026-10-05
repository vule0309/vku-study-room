import { create } from 'zustand';
import { BuildingId, CapacityRange, Equipment, RoomFilter } from '../types/booking';

interface FilterState extends RoomFilter {
  setSearchQuery: (query: string) => void;
  setBuilding: (building: BuildingId | 'ALL') => void;
  setCapacityRange: (range: CapacityRange) => void;
  toggleEquipment: (eq: Equipment) => void;
  setOnlyAvailableNow: (onlyAvailable: boolean) => void;
  resetFilters: () => void;
  getActiveFilterCount: () => number;
}

const DEFAULT_FILTERS: RoomFilter = {
  searchQuery: '',
  building: 'ALL',
  capacityRange: 'ALL',
  equipment: [],
  onlyAvailableNow: false,
};

export const useFilterStore = create<FilterState>((set, get) => ({
  ...DEFAULT_FILTERS,

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setBuilding: (building) => set({ building }),

  setCapacityRange: (capacityRange) => set({ capacityRange }),

  toggleEquipment: (eq) =>
    set((state) => {
      const exists = state.equipment.includes(eq);
      return {
        equipment: exists
          ? state.equipment.filter((item) => item !== eq)
          : [...state.equipment, eq],
      };
    }),

  setOnlyAvailableNow: (onlyAvailableNow) => set({ onlyAvailableNow }),

  resetFilters: () => set(DEFAULT_FILTERS),

  getActiveFilterCount: () => {
    const s = get();
    let count = 0;
    if (s.searchQuery.trim().length > 0) count++;
    if (s.building !== 'ALL') count++;
    if (s.capacityRange !== 'ALL') count++;
    if (s.equipment.length > 0) count += s.equipment.length;
    if (s.onlyAvailableNow) count++;
    return count;
  },
}));
