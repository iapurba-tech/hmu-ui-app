import { create } from 'zustand';

export type UserRole = 'ROLE_SYSTEM_ADMIN' | 'ROLE_UNIT_ADMIN' | 'ROLE_UNIT_MANAGER';

export interface Unit {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'standby';
  mpcsUnits: number;
  dailyVolume: string;
  color: string;
}

interface User {
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
  units: Unit[];
}

interface AuthState {
  user: User | null;
  selectedUnit: Unit | null;
  portal: 'admin' | 'management';
  setSelectedUnit: (unit: Unit | null) => void;
  setUser: (user: User | null) => void;
  setPortal: (portal: 'admin' | 'management') => void;
}

const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Shyampur Facility',
    code: 'SHY-001',
    status: 'active',
    mpcsUnits: 142,
    dailyVolume: '12,450 L',
    color: '#0077b8' // Primary Blue
  },
  {
    id: '2',
    name: 'Amta Facility',
    code: 'AMT-001',
    status: 'active',
    mpcsUnits: 86,
    dailyVolume: '7,210 L',
    color: '#863bff' // Purple
  }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    fullName: 'Apurba Panja',
    username: 'apurba.admin',
    email: 'apurba@hmu.gov.in',
    role: 'ROLE_SYSTEM_ADMIN',
    avatar: '',
    units: mockUnits,
  },
  selectedUnit: mockUnits[0],
  portal: 'management',
  setSelectedUnit: (unit) => set({ selectedUnit: unit }),
  setUser: (user) => set({ user }),
  setPortal: (portal) => set({ portal }),
}));
