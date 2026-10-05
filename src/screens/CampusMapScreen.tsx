import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';
import { Header } from '../components/common/Header';
import { colors } from '../theme/colors';
import { MOCK_ROOMS } from '../data/mockRooms';
import { BuildingId } from '../types/booking';
import { Badge } from '../components/common/Badge';

interface BuildingInfo {
  id: BuildingId;
  name: string;
  fullName: string;
  desc: string;
  floors: number;
  highlight: string;
  color: string;
}

const BUILDINGS_INFO: BuildingInfo[] = [
  {
    id: 'V',
    name: 'Tòa V - Đổi mới Sáng tạo',
    fullName: 'VKU Innovation & Maker Hub',
    desc: 'Không gian nghiên cứu AI, Data Science, Co-working space và khởi nghiệp sinh viên.',
    floors: 4,
    highlight: 'Lab AI (V.401), Co-working Space (V.202)',
    color: colors.buildingV,
  },
  {
    id: 'B',
    name: 'Tòa B - Giảng đường & Lab CNTT',
    fullName: 'Central Computer Science Hall',
    desc: 'Hệ thống phòng lab chuyên ngành Khoa học Máy tính, Kỹ thuật Phần mềm và các Study Pods.',
    floors: 4,
    highlight: 'Software Lab (B.305), Focus Pod Alpha (B.102)',
    color: colors.buildingB,
  },
  {
    id: 'C',
    name: 'Tòa C - Lab Kỹ thuật & IoT',
    fullName: 'Network Engineering & IoT Center',
    desc: 'Trung tâm nghiên cứu phần cứng, thiết bị thông minh, an toàn thông tin & CTF War Room.',
    floors: 3,
    highlight: 'IoT Prototyping (C.204), Cyber Security (C.301)',
    color: colors.buildingC,
  },
  {
    id: 'A',
    name: 'Tòa A - Hành chính & Hội thảo',
    fullName: 'Administration & Academic Seminars',
    desc: 'Hội trường lớn, phòng hội thảo chuyên đề học thuật và thảo luận nhóm tầng 1.',
    floors: 3,
    highlight: 'Executive Seminar (A.201), Academic Discussion (A.108)',
    color: colors.buildingA,
  },
];

export const CampusMapScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingId>('V');

  const currentBuildingInfo = BUILDINGS_INFO.find((b) => b.id === selectedBuilding)!;
  const buildingRooms = MOCK_ROOMS.filter((r) => r.building === selectedBuilding);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Bản Đồ & Khu Nhà VKU"
        subtitle="470 Đường Trần Đại Nghĩa, Q. Ngũ Hành Sơn, TP. Đà Nẵng"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Campus Overview Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Khuôn viên Đại học VKU</Text>
            <Text style={styles.bannerText}>
              Hệ thống phòng lab và không gian tự học chuẩn quốc tế sẵn sàng phục vụ sinh viên từ 07:30 đến 21:30 hàng ngày.
            </Text>
          </View>
          <View style={styles.bannerIconBox}>
            <Ionicons name="business" size={32} color="#FFFFFF" />
          </View>
        </View>

        {/* Building Selector Strip */}
        <Text style={styles.sectionTitle}>Chọn Tòa nhà khảo sát</Text>
        <View style={styles.buildingTabs}>
          {BUILDINGS_INFO.map((b) => {
            const isSelected = b.id === selectedBuilding;
            return (
              <TouchableOpacity
                key={b.id}
                style={[
                  styles.buildingTab,
                  isSelected && {
                    borderColor: b.color,
                    backgroundColor: '#FFFFFF',
                    shadowColor: b.color,
                    shadowOpacity: 0.2,
                    shadowRadius: 6,
                    elevation: 3,
                  },
                ]}
                onPress={() => setSelectedBuilding(b.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.tabBadge, { backgroundColor: b.color }]}>
                  <Text style={styles.tabBadgeText}>{b.id}</Text>
                </View>
                <Text
                  style={[
                    styles.tabName,
                    isSelected ? { color: colors.textPrimary, fontWeight: '700' } : { color: colors.textSecondary },
                  ]}
                >
                  Tòa {b.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Building Details Card */}
        <View style={styles.buildingCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.buildingTitle}>{currentBuildingInfo.name}</Text>
              <Text style={styles.buildingSub}>{currentBuildingInfo.fullName}</Text>
            </View>
            <Badge
              label={`${currentBuildingInfo.floors} Tầng`}
              variant="building"
              buildingId={currentBuildingInfo.id}
            />
          </View>

          <Text style={styles.buildingDesc}>{currentBuildingInfo.desc}</Text>

          <View style={styles.highlightRow}>
            <Ionicons name="sparkles" size={16} color={colors.accent} />
            <Text style={styles.highlightText}>
              Không gian tiêu biểu: {currentBuildingInfo.highlight}
            </Text>
          </View>
        </View>

        {/* List of rooms in this building */}
        <Text style={styles.sectionTitle}>
          Các phòng học thuộc Tòa {selectedBuilding} ({buildingRooms.length} phòng)
        </Text>

        <View style={styles.roomsList}>
          {buildingRooms.map((room) => (
            <TouchableOpacity
              key={room.id}
              style={styles.roomItem}
              onPress={() => navigation.navigate('RoomDetail', { room })}
              activeOpacity={0.7}
            >
              <View style={styles.roomCodeBox}>
                <Text style={styles.roomCodeText}>{room.code}</Text>
              </View>

              <View style={styles.roomInfo}>
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomSub}>
                  Tầng {room.floor} • Sức chứa {room.capacity} chỗ
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Campus Door & QR Check-in Rules */}
        <View style={styles.rulesCard}>
          <View style={styles.rulesHeader}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.rulesTitle}>Hướng dẫn Check-in Cửa & Bảo vệ</Text>
          </View>

          <View style={styles.rulePoint}>
            <Text style={styles.ruleNum}>1.</Text>
            <Text style={styles.ruleBody}>
              Đến phòng trước giờ bắt đầu tối đa 15 phút.
            </Text>
          </View>

          <View style={styles.rulePoint}>
            <Text style={styles.ruleNum}>2.</Text>
            <Text style={styles.ruleBody}>
              Mở Thẻ QR Pass trên ứng dụng và đưa vào mắt đọc cảm biến bên cạnh cửa phòng hoặc xuất trình cho cán bộ trực lab.
            </Text>
          </View>

          <View style={styles.rulePoint}>
            <Text style={styles.ruleNum}>3.</Text>
            <Text style={styles.ruleBody}>
              Nếu không check-in trong vòng 20 phút sau khi ca học bắt đầu, hệ thống sẽ tự động hủy lịch để nhường phòng cho nhóm khác.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bannerLeft: {
    flex: 1,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: '#E0F2FE',
    lineHeight: 16,
  },
  bannerIconBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  buildingTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  buildingTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 6,
  },
  tabBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  tabName: {
    fontSize: 13,
    fontWeight: '600',
  },
  buildingCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buildingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  buildingSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  buildingDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 10,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  highlightText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    flex: 1,
  },
  roomsList: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 20,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  roomCodeBox: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  roomCodeText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roomSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rulesCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  rulesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  rulePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  ruleNum: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 6,
  },
  ruleBody: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
});
