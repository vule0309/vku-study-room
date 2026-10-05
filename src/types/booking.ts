export type BuildingId = 'A' | 'B' | 'C' | 'V';

export type Equipment =
  | 'Projector'
  | 'Whiteboard'
  | 'High-spec PC'
  | 'AC'
  | 'Sound System'
  | 'Dual Monitors';

export interface Room {
  id: string;
  code: string;
  name: string;
  building: BuildingId;
  floor: number;
  capacity: number;
  image: string;
  equipment: Equipment[];
  description: string;
  guidelines: string[];
}

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  shiftName: string;
}

export type SlotStatus = 'available' | 'booked' | 'expired' | 'mine';

export interface SlotAvailability {
  slot: TimeSlot;
  status: SlotStatus;
  bookingId?: string;
  bookedByStudentName?: string;
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'cancelled';

export interface Booking {
  id: string;
  referenceCode: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  building: BuildingId;
  floor: number;
  date: string; // YYYY-MM-DD
  slotId: string;
  startTime: string;
  endTime: string;
  shiftName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  memberCount: number;
  createdAt: string;
  status: BookingStatus;
  notificationId?: string;
  checkedInAt?: string;
}

export interface UserProfile {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  faculty: string;
  classCode: string;
  avatar: string;
}

export type CapacityRange = 'ALL' | '2-6' | '6-12' | '12-20';

export interface RoomFilter {
  searchQuery: string;
  building: BuildingId | 'ALL';
  capacityRange: CapacityRange;
  equipment: Equipment[];
  onlyAvailableNow: boolean;
}
