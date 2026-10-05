export function generateBookingReference(roomId: string, date: string, slotId: string): string {
  const cleanDate = date.replace(/-/g, '');
  const cleanRoom = roomId.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const cleanSlot = slotId.replace(/[^0-9]/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `VKU-${cleanRoom}-${cleanDate}-S${cleanSlot}-${randomSuffix}`;
}

export function generateQrPayload(booking: {
  id: string;
  referenceCode: string;
  roomCode: string;
  studentId: string;
  date: string;
  startTime: string;
}): string {
  return JSON.stringify({
    app: 'VKU-STUDYSPACE',
    id: booking.id,
    ref: booking.referenceCode,
    room: booking.roomCode,
    student: booking.studentId,
    date: booking.date,
    time: booking.startTime,
    validUntil: `${booking.date}T23:59:59`,
  });
}
