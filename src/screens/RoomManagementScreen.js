import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TextInput as RNTextInput } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DataContext } from '../context/DataContext';
import { Header, FilterBar, FloatingActionButton } from '../components/Common';
import { RoomCard } from '../components/Card';
import { FormModal, TextInputField, SelectField, ConfirmModal } from '../components/FormComponents';

const roomFilters = [
  { key: 'all', label: 'Tất cả' },
  { key: 'available', label: 'Trống' },
  { key: 'occupied', label: 'Đang thuê' },
  { key: 'under_maintenance', label: 'Bảo trì' },
];

export const RoomManagementScreen = ({ navigation }) => {
  const { rooms, tenants, addRoom, updateRoom, deleteRoom, getRoomOccupiedSlots, getRoomAvailableSlots } = useContext(DataContext);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState(null);
  const [searchText, setSearchText] = useState('');

  // Form states
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [capacity, setCapacity] = useState('');
  const [floor, setFloor] = useState('');

  useEffect(() => {
    filterRooms();
  }, [rooms, tenants, selectedFilter, searchText]);

  const filterRooms = () => {
    let filtered = rooms;

    if (selectedFilter === 'available') {
      filtered = filtered.filter(room => getRoomOccupiedSlots(room) === 0 && room.status !== 'under_maintenance');
    } else if (selectedFilter === 'occupied') {
      filtered = filtered.filter(room => getRoomOccupiedSlots(room) > 0);
    } else if (selectedFilter === 'under_maintenance') {
      filtered = filtered.filter(room => room.status === 'under_maintenance');
    }

    if (searchText) {
      filtered = filtered.filter(room =>
        String(room.number).includes(searchText) ||
        room.type.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setRoomNumber('');
    setRoomType('');
    setPrice('');
    setArea('');
    setCapacity('');
    setFloor('');
    setModalVisible(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomNumber(room.number);
    setRoomType(room.type);
    setPrice(room.price.toString());
    setArea(room.area.toString());
    setCapacity(room.capacity.toString());
    setFloor(room.floor.toString());
    setModalVisible(true);
  };

  const handleSaveRoom = async () => {
    if (!roomNumber || !roomType || !price || !capacity || !floor) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const nextCapacity = parseInt(capacity) || 0;
    if (nextCapacity < 1) {
      alert('Sức chứa phải lớn hơn 0');
      return;
    }

    if (editingRoom && nextCapacity < getRoomOccupiedSlots(editingRoom)) {
      alert(`Phòng đang có ${getRoomOccupiedSlots(editingRoom)} khách, không thể đặt sức chứa nhỏ hơn số khách hiện tại`);
      return;
    }

    if (editingRoom) {
      await updateRoom(editingRoom.id, {
        number: roomNumber,
        type: roomType,
        price: parseInt(price),
        area: parseInt(area) || 0,
        capacity: nextCapacity,
        floor: parseInt(floor) || 1,
      });
    } else {
      await addRoom({
        number: roomNumber,
        type: roomType,
        price: parseInt(price),
        area: parseInt(area) || 0,
        capacity: nextCapacity,
        floor: parseInt(floor) || 1,
      });
    }

    setModalVisible(false);
  };

  const handleDeleteRoom = async (roomId) => {
    await deleteRoom(roomId);
    setConfirmVisible(false);
    setDeletingRoomId(null);
  };

  const renderRoom = ({ item }) => {
    const displayRoom = {
      ...item,
      occupiedSlots: getRoomOccupiedSlots(item),
      availableSlots: getRoomAvailableSlots(item),
    };

    return (
      <RoomCard
        room={displayRoom}
        onEdit={() => handleEditRoom(item)}
        onDelete={() => {
          setDeletingRoomId(item.id);
          setConfirmVisible(true);
        }}
        onView={() => navigation.navigate('RoomDetail', { roomId: item.id })}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Danh sách phòng"
        showNotification={false}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
        <RNTextInput
          style={styles.searchInput}
          placeholder="Tìm theo số phòng..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Chips */}
      <FilterBar
        filters={roomFilters}
        selectedValue={selectedFilter}
        onChange={setSelectedFilter}
      />

      {/* Room List */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoom}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="home-off" size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>Không tìm thấy phòng nào</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Add Room Modal */}
      <FormModal
        visible={modalVisible}
        title={editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSaveRoom}
      >
        <TextInputField
          label="Số phòng"
          value={roomNumber}
          onChangeText={setRoomNumber}
          placeholder="101"
          icon="home"
        />

        <SelectField
          label="Loại phòng"
          value={roomType}
          onValueChange={setRoomType}
          items={[
            { label: 'Studio', value: 'Studio' },
            { label: '1 Phòng ngủ', value: '1 Phòng ngủ' },
            { label: '2 Phòng ngủ', value: '2 Phòng ngủ' },
            { label: '3 Phòng ngủ', value: '3 Phòng ngủ' },
            { label: 'Penthouse', value: 'Penthouse' },
          ]}
          placeholder="Chọn loại phòng"
          icon="home-city"
        />

        <TextInputField
          label="Giá thuê (đ/tháng)"
          value={price}
          onChangeText={setPrice}
          placeholder="3000000"
          icon="currency-usd"
          keyboardType="numeric"
        />

        <TextInputField
          label="Diện tích (m²)"
          value={area}
          onChangeText={setArea}
          placeholder="25"
          icon="ruler"
          keyboardType="numeric"
        />

        <TextInputField
          label="Sức chứa (người)"
          value={capacity}
          onChangeText={setCapacity}
          placeholder="2"
          icon="account-multiple"
          keyboardType="numeric"
        />

        <TextInputField
          label="Tầng"
          value={floor}
          onChangeText={setFloor}
          placeholder="1"
          icon="layers"
          keyboardType="numeric"
        />
      </FormModal>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Xóa phòng"
        message="Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác."
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={() => handleDeleteRoom(deletingRoomId)}
        onCancel={() => {
          setConfirmVisible(false);
          setDeletingRoomId(null);
        }}
      />

      <FloatingActionButton
        onPress={handleAddRoom}
        icon="plus"
        color="#3B82F6"
      />
    </View>
  );
};

// TextInput component wrapper
const TextInput = ({ style, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <View
      style={[
        styles.inputWrapper,
        focused && styles.inputFocused,
      ]}
    >
      <RNTextInput
        {...props}
        style={[styles.input, style]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8DEE9',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  inputFocused: {
    borderColor: '#3B82F6',
  },
  input: {
    paddingVertical: 10,
    fontSize: 14,
    color: '#1F2937',
  },
});
