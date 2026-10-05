import { Room } from '../types/booking';

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-v401',
    code: 'V.401',
    name: 'AI & Data Innovation Hub',
    building: 'V',
    floor: 4,
    capacity: 12,
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
    equipment: ['High-spec PC', 'Projector', 'Whiteboard', 'AC', 'Dual Monitors'],
    description: 'Phòng thực hành chuyên đề Trí tuệ Nhân tạo và Khoa học Dữ liệu, trang bị dàn máy trạm GPU RTX 4080 cho đồ án tốt nghiệp và nghiên cứu nhóm.',
    guidelines: [
      'Không mang đồ ăn và nước ngọt có gas vào phòng lab máy tính',
      'Đăng xuất các tài khoản cloud trước khi rời phòng',
      'Check-in bằng mã QR tại cửa phòng trước khi bắt đầu 10 phút'
    ],
  },
  {
    id: 'room-v202',
    code: 'V.202',
    name: 'Startup Co-working Space',
    building: 'V',
    floor: 2,
    capacity: 18,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    equipment: ['Projector', 'Whiteboard', 'AC', 'Sound System'],
    description: 'Không gian mở thiết kế hiện đại phục vụ các nhóm sinh viên ươm mầm khởi nghiệp VKU, pitching ý tưởng và thảo luận dự án liên ngành.',
    guidelines: [
      'Giữ trật tự khu vực hành lang chung tòa nhà V',
      'Xóa sạch bảng trắng sau khi kết thúc buổi họp',
      'Tắt máy chiếu và điều hòa khi ra về'
    ],
  },
  {
    id: 'room-b305',
    code: 'B.305',
    name: 'Software Engineering Lab',
    building: 'B',
    floor: 3,
    capacity: 16,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    equipment: ['High-spec PC', 'Dual Monitors', 'Projector', 'AC'],
    description: 'Phòng máy tính cấu hình cao Khoa Khoa học Máy tính dành cho các nhóm làm bài tập lớn phần mềm, hackathon và thi lập trình ACM/ICPC.',
    guidelines: [
      'Bảo quản thiết bị ngoại vi bàn phím chuột',
      'Không tự ý cài đặt lại phần mềm hệ thống',
      'Báo ngay cho cán bộ phụ trách lab nếu máy gặp sự cố'
    ],
  },
  {
    id: 'room-b102',
    code: 'B.102',
    name: 'Study Pod Focus Alpha',
    building: 'B',
    floor: 1,
    capacity: 4,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    equipment: ['Whiteboard', 'AC'],
    description: 'Phòng học nhóm nhỏ cách âm tĩnh lặng, lý tưởng cho 2-4 bạn ôn thi học phần, làm bài tập giải thuật hoặc phỏng vấn trực tuyến.',
    guidelines: [
      'Phòng cách âm - vui lòng đóng kín cửa khi đàm thoại',
      'Tối đa 4 người theo đúng quy chuẩn an toàn',
      'Vệ sinh bàn ghế sạch sẽ trước khi bàn giao'
    ],
  },
  {
    id: 'room-a201',
    code: 'A.201',
    name: 'Executive Seminar Room',
    building: 'A',
    floor: 2,
    capacity: 20,
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    equipment: ['Projector', 'Sound System', 'AC', 'Whiteboard'],
    description: 'Phòng hội thảo chuyên đề tòa nhà A với hệ thống âm thanh vòm, máy chiếu laser siêu sáng, bàn chữ U cho báo cáo khoa học sinh viên.',
    guidelines: [
      'Chỉ dành cho các buổi báo cáo, seminar từ 10 thành viên trở lên',
      'Kiểm tra micro không dây trước và sau khi sử dụng',
      'Tắt toàn bộ hệ thống âm ly trước khi khóa cửa'
    ],
  },
  {
    id: 'room-a108',
    code: 'A.108',
    name: 'Academic Peer Discussion',
    building: 'A',
    floor: 1,
    capacity: 6,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    equipment: ['Whiteboard', 'AC'],
    description: 'Phòng thảo luận tầng 1 khu hành chính thư viện, không gian yên tĩnh, bàn tròn gắn ổ cắm sạc laptop thuận tiện.',
    guidelines: [
      'Không di dời bàn ghế sang khu vực khác',
      'Giữ âm lượng vừa phải tôn trọng người xung quanh',
      'Không dán giấy decan lên mặt kính'
    ],
  },
  {
    id: 'room-c204',
    code: 'C.204',
    name: 'IoT & Smart Device Prototyping',
    building: 'C',
    floor: 2,
    capacity: 10,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    equipment: ['High-spec PC', 'Projector', 'AC', 'Whiteboard'],
    description: 'Phòng thí nghiệm Kỹ thuật Mạng & IoT trang bị bàn thí nghiệm chống tĩnh điện, các bộ kit ESP32, Raspberry Pi và máy tính đo kiểm.',
    guidelines: [
      'Tắt nguồn các bộ cấp nguồn DC khi rời vị trí',
      'Thu dọn dây nối breadboard vào hộp linh kiện',
      'Cấm sử dụng mỏ hàn nếu không có cán bộ giám sát'
    ],
  },
  {
    id: 'room-c301',
    code: 'C.301',
    name: 'Cyber Security War Room',
    building: 'C',
    floor: 3,
    capacity: 8,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    equipment: ['High-spec PC', 'Dual Monitors', 'AC', 'Whiteboard'],
    description: 'Phòng luyện tập An toàn Thông tin & CTF mạng nội bộ riêng biệt, màn hình kép phục vụ phân tích mã độc và kiểm thử thâm nhập.',
    guidelines: [
      'Chỉ sử dụng dải IP mạng nội bộ quy định trong bài thực hành',
      'Tuyệt đối không tấn công mạng ngoài khuôn viên VKU',
      'Bảo mật thông tin đăng nhập hệ thống lab'
    ],
  },
  {
    id: 'room-v105',
    code: 'V.105',
    name: 'Creative Media & UI/UX Studio',
    building: 'V',
    floor: 1,
    capacity: 8,
    image: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80',
    equipment: ['High-spec PC', 'Dual Monitors', 'Whiteboard', 'AC'],
    description: 'Studio đồ họa và trải nghiệm người dùng với bảng vẽ Wacom, màn hình chuẩn màu AdobeRGB cho nhóm thiết kế App và Multimedia.',
    guidelines: [
      'Cẩn trọng với màn hình đồ họa độ chính xác cao',
      'Định kỳ sao lưu sản phẩm lên Google Drive trường',
      'Khóa tủ phụ kiện sau khi trả bút cảm ứng'
    ],
  },
  {
    id: 'room-b402',
    code: 'B.402',
    name: 'Quiet Group Pod Beta',
    building: 'B',
    floor: 4,
    capacity: 3,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    equipment: ['AC', 'Whiteboard'],
    description: 'Không gian học tập yên tĩnh view tầng cao nhìn ra khuôn viên trường, phù hợp cho nhóm đồ án 2-3 bạn tập trung cao độ.',
    guidelines: [
      'Tuyệt đối giữ yên lặng cho các phòng lân cận',
      'Không để lại rác thải cá nhân',
      'Check-in đúng giờ để tránh tự động hủy chỗ'
    ],
  },
];
