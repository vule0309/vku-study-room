import { Room, Booking } from './booking';

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetail: { room: Room };
  BookingConfirm: { room: Room; date: string; slotId: string };
  BookingPass: { booking: Booking };
};

export type TabParamList = {
  Discovery: undefined;
  MyBookings: undefined;
  CampusMap: undefined;
  Profile: undefined;
};
