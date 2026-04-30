import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  formatAppDate,
  formatInvoiceMonth,
  getMonthKey,
  getMonthlyDueDate,
  getMonthlyInvoiceDates,
  parseAppDate,
} from '../utils/helpers';
import { fileStorage } from '../services/fileStorage';

export const DataContext = createContext();

const STORAGE_KEYS = {
  ROOMS: 'sanctuary_rooms',
  TENANTS: 'sanctuary_tenants',
  INVOICES: 'sanctuary_invoices',
  CONTRACTS: 'sanctuary_contracts',
  USERS: 'sanctuary_users',
};

const STORAGE_BUCKETS = {
  [STORAGE_KEYS.ROOMS]: 'rooms',
  [STORAGE_KEYS.TENANTS]: 'tenants',
  [STORAGE_KEYS.INVOICES]: 'invoices',
  [STORAGE_KEYS.CONTRACTS]: 'contracts',
  [STORAGE_KEYS.USERS]: 'users',
};

// Default login users. Rooms, tenants, invoices and contracts start empty.
const MOCK_ROOMS = [
  { id: 1, floor: 1, number: '101', type: 'Studio', price: 3000000, area: 25, capacity: 2, status: 'occupied', tenantId: 1 },
  { id: 2, floor: 1, number: '102', type: 'Studio', price: 2800000, area: 20, capacity: 2, status: 'occupied', tenantId: 2 },
  { id: 3, floor: 2, number: '201', type: '1 Phòng ngủ', price: 3500000, area: 30, capacity: 4, status: 'available', tenantId: null },
];

const MOCK_TENANTS = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', idCard: '001203004567', roomId: 1, status: 'active', startDate: '2024-01-15' },
  { id: 2, name: 'Trần Thị B', phone: '0987654321', idCard: '031200008912', roomId: 2, status: 'active', startDate: '2024-02-02' },
];

const MOCK_INVOICES = [
  { id: 1, roomId: 1, tenantId: 1, month: '10/2023', amount: 3500000, electricity: 420000, water: 80000, status: 'paid', dueDate: '2023-10-05' },
  { id: 2, roomId: 2, tenantId: 2, month: '10/2023', amount: 3100000, electricity: 250000, water: 50000, status: 'unpaid', dueDate: '2023-10-05' },
];

const MOCK_CONTRACTS = [
  { id: 1, tenantId: 1, roomId: 1, startDate: '2023-01-15', endDate: '2024-12-31', status: 'active', amount: 3000000 },
  { id: 2, tenantId: 2, roomId: 2, startDate: '2023-02-02', endDate: '2024-11-15', status: 'active', amount: 2800000 },
];

const MOCK_USERS = [
  { id: 1, name: 'Quản trị viên', email: 'admin@rental.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Quản lý viên', email: 'manager@rental.com', role: 'manager', status: 'active' },
];

const mergeUsersWithDefaults = (storedUsers = []) => {
  const storedByEmail = new Map(storedUsers.map(user => [user.email, user]));
  const mergedDefaults = MOCK_USERS.map(defaultUser => ({
    ...(storedByEmail.get(defaultUser.email) || {}),
    id: defaultUser.id,
    name: defaultUser.name,
    email: defaultUser.email,
  }));
  const defaultEmails = new Set(MOCK_USERS.map(user => user.email));
  const customUsers = storedUsers.filter(user => !defaultEmails.has(user.email) && user.role !== 'tenant');

  return [...mergedDefaults, ...customUsers];
};

const LEGACY_SAMPLE_IDS = {
  rooms: new Set([1, 2, 3]),
  tenants: new Set([1, 2]),
  invoices: new Set([1, 2]),
  contracts: new Set([1, 2]),
};

const stripLegacySamples = (records, type) => {
  const sampleIds = LEGACY_SAMPLE_IDS[type];
  if (!sampleIds) return records;
  return records.filter(record => !sampleIds.has(record.id));
};

const getRecordArray = (records, type) => {
  if (!Array.isArray(records)) return [];
  return stripLegacySamples(records, type);
};

const getStoredRecords = (rawData, type) => {
  if (!rawData) return [];
  try {
    return getRecordArray(JSON.parse(rawData), type);
  } catch (error) {
    return [];
  }
};

const getStoredUsers = (rawData) => {
  if (!rawData) return null;
  try {
    const parsedUsers = JSON.parse(rawData);
    return Array.isArray(parsedUsers) ? parsedUsers : null;
  } catch (error) {
    return null;
  }
};

const hasBusinessData = (data = {}) => (
  getRecordArray(data.rooms, 'rooms').length > 0 ||
  getRecordArray(data.tenants, 'tenants').length > 0 ||
  getRecordArray(data.invoices, 'invoices').length > 0 ||
  getRecordArray(data.contracts, 'contracts').length > 0
);

const hasCustomUsers = (data = {}) => {
  if (!Array.isArray(data.users)) return false;

  return data.users.some(user => {
    const defaultUser = MOCK_USERS.find(item => item.email === user.email);
    return !defaultUser || defaultUser.role !== user.role || defaultUser.status !== user.status;
  });
};

const hasStoredData = (data = {}) => hasBusinessData(data) || hasCustomUsers(data);

const getRoomCapacityValue = (room) => Math.max(parseInt(room?.capacity, 10) || 1, 1);

const getActiveRoomTenants = (roomId, tenantsList = [], ignoredTenantId = null) => (
  tenantsList.filter(tenant =>
    tenant.roomId === roomId &&
    tenant.status === 'active' &&
    tenant.id !== ignoredTenantId
  )
);

const getRoomOccupiedSlotsFrom = (roomId, tenantsList = [], ignoredTenantId = null) => (
  getActiveRoomTenants(roomId, tenantsList, ignoredTenantId).length
);

const getRoomAvailableSlotsFrom = (room, tenantsList = [], ignoredTenantId = null) => {
  if (!room || room.status === 'under_maintenance') return 0;
  return Math.max(getRoomCapacityValue(room) - getRoomOccupiedSlotsFrom(room.id, tenantsList, ignoredTenantId), 0);
};

const decorateRoomsWithOccupancy = (roomsList = [], tenantsList = []) => (
  roomsList.map(room => {
    const activeTenants = getActiveRoomTenants(room.id, tenantsList);
    const capacity = getRoomCapacityValue(room);
    const occupiedSlots = activeTenants.length;
    const availableSlots = room.status === 'under_maintenance'
      ? 0
      : Math.max(capacity - occupiedSlots, 0);

    return {
      ...room,
      capacity,
      occupiedSlots,
      availableSlots,
      tenantId: activeTenants[0]?.id || null,
      tenantIds: activeTenants.map(tenant => tenant.id),
      status: room.status === 'under_maintenance'
        ? 'under_maintenance'
        : occupiedSlots > 0 ? 'occupied' : 'available',
    };
  })
);

const createMonthlyInvoicesForTenant = (tenant, roomsList, currentInvoices, today = new Date()) => {
  const room = roomsList.find(item => item.id === tenant.roomId);
  if (!room || !tenant.startDate || tenant.status !== 'active') return [];

  const existingKeys = new Set(
    currentInvoices
      .filter(invoice => String(invoice.tenantId) === String(tenant.id))
      .map(invoice => getMonthKey(invoice.month))
  );

  return getMonthlyInvoiceDates(tenant.startDate, today)
    .filter(monthDate => !existingKeys.has(getMonthKey(monthDate)))
    .map((monthDate, index) => ({
      id: Date.now() + tenant.id + index,
      roomId: tenant.roomId,
      tenantId: tenant.id,
      month: formatInvoiceMonth(monthDate),
      amount: room.price || 0,
      electricity: 0,
      water: 0,
      status: 'unpaid',
      dueDate: getMonthlyDueDate(tenant.startDate, monthDate),
      rentalStartDate: tenant.startDate,
      autoGenerated: true,
    }));
};

const addMissingMonthlyInvoices = (tenantsList, roomsList, currentInvoices, today = new Date()) => {
  let nextInvoices = currentInvoices;

  tenantsList.forEach(tenant => {
    const generatedInvoices = createMonthlyInvoicesForTenant(tenant, roomsList, nextInvoices, today);
    if (generatedInvoices.length > 0) {
      nextInvoices = [...nextInvoices, ...generatedInvoices];
    }
  });

  return nextInvoices;
};

const rebuildTenantMonthlyInvoices = (tenant, roomsList, currentInvoices) => {
  const retainedInvoices = currentInvoices.filter(invoice =>
    String(invoice.tenantId) !== String(tenant.id) || !invoice.autoGenerated
  );

  return addMissingMonthlyInvoices([tenant], roomsList, retainedInvoices);
};

export const DataProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from the JSON file server first, then AsyncStorage as fallback.
  useEffect(() => {
    loadData();
  }, []);

  const readLocalData = async () => {
    const [roomsData, tenantsData, invoicesData, contractsData, usersData] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.ROOMS),
      AsyncStorage.getItem(STORAGE_KEYS.TENANTS),
      AsyncStorage.getItem(STORAGE_KEYS.INVOICES),
      AsyncStorage.getItem(STORAGE_KEYS.CONTRACTS),
      AsyncStorage.getItem(STORAGE_KEYS.USERS),
    ]);

    return {
      rooms: getStoredRecords(roomsData, 'rooms'),
      tenants: getStoredRecords(tenantsData, 'tenants'),
      invoices: getStoredRecords(invoicesData, 'invoices'),
      contracts: getStoredRecords(contractsData, 'contracts'),
      users: getStoredUsers(usersData),
    };
  };

  const prepareLoadedData = (rawData = {}) => {
    const nextTenants = getRecordArray(rawData.tenants, 'tenants').map(tenant => ({
      ...tenant,
      startDate: formatAppDate(tenant.startDate),
    }));
    const nextRooms = decorateRoomsWithOccupancy(getRecordArray(rawData.rooms, 'rooms'), nextTenants);
    const storedInvoices = getRecordArray(rawData.invoices, 'invoices');
    const nextInvoices = addMissingMonthlyInvoices(nextTenants, nextRooms, storedInvoices);
    const nextContracts = getRecordArray(rawData.contracts, 'contracts').map(contract => ({
      ...contract,
      startDate: formatAppDate(contract.startDate),
      endDate: formatAppDate(contract.endDate),
    }));
    const parsedUsers = Array.isArray(rawData.users) ? rawData.users : null;
    const nextUsers = parsedUsers ? mergeUsersWithDefaults(parsedUsers) : MOCK_USERS;

    return {
      nextRooms,
      nextTenants,
      storedInvoices,
      nextInvoices,
      nextContracts,
      parsedUsers,
      nextUsers,
    };
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [fileData, localData] = await Promise.all([
        fileStorage.getData(),
        readLocalData(),
      ]);
      const shouldMigrateLocalToFile = fileData && !hasStoredData(fileData) && hasStoredData(localData);
      const sourceData = fileData
        ? (shouldMigrateLocalToFile ? localData : fileData)
        : localData;
      const {
        nextRooms,
        nextTenants,
        storedInvoices,
        nextInvoices,
        nextContracts,
        parsedUsers,
        nextUsers,
      } = prepareLoadedData(sourceData);

      setRooms(nextRooms);
      setTenants(nextTenants);
      setInvoices(nextInvoices);
      setContracts(nextContracts);
      setUsers(nextUsers);

      if (shouldMigrateLocalToFile) {
        await fileStorage.putData({
          rooms: nextRooms,
          tenants: nextTenants,
          invoices: nextInvoices,
          contracts: nextContracts,
          users: nextUsers,
        });
      }

      if (JSON.stringify(nextInvoices) !== JSON.stringify(storedInvoices)) {
        await saveToStorage(STORAGE_KEYS.INVOICES, nextInvoices);
      }
      if (parsedUsers && JSON.stringify(nextUsers) !== JSON.stringify(parsedUsers)) {
        await saveToStorage(STORAGE_KEYS.USERS, nextUsers);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      const fileBucket = STORAGE_BUCKETS[key];
      if (fileBucket) {
        await fileStorage.patchData({ [fileBucket]: data });
      }
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  const syncGeneratedInvoices = useCallback(async () => {
    if (isLoading) return;

    const updatedInvoices = addMissingMonthlyInvoices(tenants, rooms, invoices);
    if (updatedInvoices.length !== invoices.length) {
      setInvoices(updatedInvoices);
      await saveToStorage(STORAGE_KEYS.INVOICES, updatedInvoices);
    }
  }, [isLoading, tenants, rooms, invoices]);

  useEffect(() => {
    if (isLoading) return undefined;

    syncGeneratedInvoices();
    const timer = setInterval(syncGeneratedInvoices, 60 * 60 * 1000);
    return () => clearInterval(timer);
  }, [isLoading, syncGeneratedInvoices]);

  // ROOM OPERATIONS
  const addRoom = async (roomData) => {
    const newRoom = { ...roomData, id: Date.now(), status: 'available' };
    const updatedRooms = decorateRoomsWithOccupancy([...rooms, newRoom], tenants);
    setRooms(updatedRooms);
    await saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
    return newRoom;
  };

  const updateRoom = async (id, roomData) => {
    const updatedRooms = decorateRoomsWithOccupancy(
      rooms.map(room => room.id === id ? { ...room, ...roomData } : room),
      tenants
    );
    setRooms(updatedRooms);
    await saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
  };

  const deleteRoom = async (id) => {
    const updatedRooms = rooms.filter(room => room.id !== id);
    setRooms(updatedRooms);
    await saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
  };

  // TENANT OPERATIONS
  const addTenant = async (tenantData) => {
    const selectedRoom = rooms.find(room => room.id === tenantData.roomId);
    if (!selectedRoom || getRoomAvailableSlotsFrom(selectedRoom, tenants) <= 0) {
      throw new Error('Phòng đã hết chỗ');
    }

    const newTenant = {
      ...tenantData,
      id: Date.now(),
      status: 'active',
      startDate: formatAppDate(tenantData.startDate),
    };
    const updatedTenants = [...tenants, newTenant];
    setTenants(updatedTenants);
    await saveToStorage(STORAGE_KEYS.TENANTS, updatedTenants);

    const updatedRooms = decorateRoomsWithOccupancy(rooms, updatedTenants);
    setRooms(updatedRooms);
    await saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);

    const updatedInvoices = rebuildTenantMonthlyInvoices(newTenant, updatedRooms, invoices);
    setInvoices(updatedInvoices);
    await saveToStorage(STORAGE_KEYS.INVOICES, updatedInvoices);

    return newTenant;
  };

  const updateTenant = async (id, tenantData) => {
    const currentTenant = tenants.find(tenant => tenant.id === id);
    const normalizedTenantData = {
      ...tenantData,
      startDate: formatAppDate(tenantData.startDate),
    };
    const selectedRoom = rooms.find(room => room.id === normalizedTenantData.roomId);
    if (!selectedRoom || getRoomAvailableSlotsFrom(selectedRoom, tenants, id) <= 0) {
      throw new Error('Phòng đã hết chỗ');
    }

    const nextTenant = { ...currentTenant, ...normalizedTenantData };
    const updatedTenants = tenants.map(tenant => tenant.id === id ? nextTenant : tenant);
    setTenants(updatedTenants);
    await saveToStorage(STORAGE_KEYS.TENANTS, updatedTenants);

    const updatedRooms = decorateRoomsWithOccupancy(rooms, updatedTenants);
    setRooms(updatedRooms);
    await saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);

    const shouldRebuildInvoices = currentTenant && (
      currentTenant.roomId !== nextTenant.roomId ||
      formatAppDate(currentTenant.startDate) !== nextTenant.startDate
    );
    const updatedInvoices = shouldRebuildInvoices
      ? rebuildTenantMonthlyInvoices(nextTenant, updatedRooms, invoices)
      : addMissingMonthlyInvoices([nextTenant], updatedRooms, invoices);
    setInvoices(updatedInvoices);
    await saveToStorage(STORAGE_KEYS.INVOICES, updatedInvoices);
  };

  const deleteTenant = async (id) => {
    const updatedTenants = tenants.filter(tenant => tenant.id !== id);
    setTenants(updatedTenants);
    await saveToStorage(STORAGE_KEYS.TENANTS, updatedTenants);

    const updatedRooms = decorateRoomsWithOccupancy(rooms, updatedTenants);
    setRooms(updatedRooms);
    await saveToStorage(STORAGE_KEYS.ROOMS, updatedRooms);
  };

  // INVOICE OPERATIONS
  const normalizeInvoiceStatus = (status) => status === 'paid' ? 'paid' : 'unpaid';

  const applyInvoicePaymentStatus = (invoiceData, existingInvoice = {}) => {
    const hasStatus = Object.prototype.hasOwnProperty.call(invoiceData, 'status');
    const nextInvoice = {
      ...existingInvoice,
      ...invoiceData,
      status: normalizeInvoiceStatus(hasStatus ? invoiceData.status : existingInvoice.status),
    };

    if (nextInvoice.status === 'paid') {
      nextInvoice.paidDate = nextInvoice.paidDate || new Date().toISOString();
    } else {
      delete nextInvoice.paidDate;
    }

    return nextInvoice;
  };

  const addInvoice = async (invoiceData) => {
    const hasTenantId = invoiceData.tenantId !== null && invoiceData.tenantId !== undefined;
    const existingInvoice = invoices.find(invoice => {
      const sameMonth = getMonthKey(invoice.month) === getMonthKey(invoiceData.month);
      if (!sameMonth) return false;

      if (hasTenantId) {
        return String(invoice.tenantId) === String(invoiceData.tenantId);
      }

      return (
        (invoice.tenantId === null || invoice.tenantId === undefined) &&
        invoice.roomId === invoiceData.roomId
      );
    });
    const updatedInvoices = existingInvoice
      ? invoices.map(invoice =>
          invoice.id === existingInvoice.id
            ? applyInvoicePaymentStatus(invoiceData, invoice)
            : invoice
        )
      : [...invoices, applyInvoicePaymentStatus({ ...invoiceData, id: Date.now() })];
    setInvoices(updatedInvoices);
    await saveToStorage(STORAGE_KEYS.INVOICES, updatedInvoices);
    return existingInvoice
      ? updatedInvoices.find(invoice => invoice.id === existingInvoice.id)
      : updatedInvoices[updatedInvoices.length - 1];
  };

  const updateInvoice = async (id, invoiceData) => {
    const updatedInvoices = invoices.map(invoice =>
      invoice.id === id ? applyInvoicePaymentStatus(invoiceData, invoice) : invoice
    );
    setInvoices(updatedInvoices);
    await saveToStorage(STORAGE_KEYS.INVOICES, updatedInvoices);
  };

  const deleteInvoice = async (id) => {
    const updatedInvoices = invoices.filter(invoice => invoice.id !== id);
    setInvoices(updatedInvoices);
    await saveToStorage(STORAGE_KEYS.INVOICES, updatedInvoices);
  };

  const markInvoiceAsPaid = async (id) => {
    await updateInvoice(id, { status: 'paid' });
  };

  const markInvoiceAsUnpaid = async (id) => {
    await updateInvoice(id, { status: 'unpaid' });
  };

  // CONTRACT OPERATIONS
  const addContract = async (contractData) => {
    const normalizedContractData = {
      ...contractData,
      startDate: formatAppDate(contractData.startDate),
      endDate: formatAppDate(contractData.endDate),
    };
    const newContract = { ...normalizedContractData, id: Date.now(), status: getContractStatus(normalizedContractData.endDate) };
    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    await saveToStorage(STORAGE_KEYS.CONTRACTS, updatedContracts);
    return newContract;
  };

  const updateContract = async (id, contractData) => {
    const updatedContracts = contracts.map(contract =>
      contract.id === id
        ? {
            ...contract,
            ...contractData,
            startDate: formatAppDate(contractData.startDate || contract.startDate),
            endDate: formatAppDate(contractData.endDate || contract.endDate),
            status: getContractStatus(contractData.endDate || contract.endDate),
          }
        : contract
    );
    setContracts(updatedContracts);
    await saveToStorage(STORAGE_KEYS.CONTRACTS, updatedContracts);
  };

  const deleteContract = async (id) => {
    const updatedContracts = contracts.filter(contract => contract.id !== id);
    setContracts(updatedContracts);
    await saveToStorage(STORAGE_KEYS.CONTRACTS, updatedContracts);
  };

  const renewContract = async (id, newEndDate) => {
    await updateContract(id, { endDate: formatAppDate(newEndDate), status: getContractStatus(newEndDate) });
  };

  // USER OPERATIONS
  const updateUserRole = async (userId, newRole) => {
    const updatedUsers = users.map(user => user.id === userId ? { ...user, role: newRole } : user);
    setUsers(updatedUsers);
    await saveToStorage(STORAGE_KEYS.USERS, updatedUsers);

    const currentUserData = await AsyncStorage.getItem('userData');
    if (currentUserData) {
      const parsedUserData = JSON.parse(currentUserData);
      if (parsedUserData?.id === userId) {
        const updatedUserData = { ...parsedUserData, role: newRole };
        await AsyncStorage.setItem('userRole', newRole);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
    }
  };

  const toggleUserStatus = async (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: user.status === 'active' ? 'locked' : 'active' } : user
    );
    setUsers(updatedUsers);
    await saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
  };

  // UTILITY FUNCTIONS
  const getRoomById = (id) => rooms.find(room => room.id === id);
  const getTenantById = (id) => tenants.find(tenant => tenant.id === id);
  const getInvoicesByTenant = (tenantId) => invoices.filter(invoice => invoice.tenantId === tenantId);
  const getContractsByTenant = (tenantId) => contracts.filter(contract => contract.tenantId === tenantId);
  const resolveRoom = (roomOrId) => (
    typeof roomOrId === 'object'
      ? roomOrId
      : rooms.find(room => room.id === roomOrId)
  );
  const getRoomOccupiedSlots = (roomOrId, ignoredTenantId = null) => {
    const room = resolveRoom(roomOrId);
    return room ? getRoomOccupiedSlotsFrom(room.id, tenants, ignoredTenantId) : 0;
  };
  const getRoomAvailableSlots = (roomOrId, ignoredTenantId = null) => {
    const room = resolveRoom(roomOrId);
    return getRoomAvailableSlotsFrom(room, tenants, ignoredTenantId);
  };
  const getAvailableRooms = (ignoredTenantId = null) => (
    rooms.filter(room => getRoomAvailableSlots(room, ignoredTenantId) > 0)
  );

  const getInvoiceStatus = (invoice) => {
    if (invoice.status === 'paid') return 'paid';
    const dueDate = parseAppDate(invoice.dueDate);
    if (!dueDate) return 'unpaid';
    return dueDate < parseAppDate(new Date()) ? 'overdue' : 'unpaid';
  };

  function getContractStatus(endDateValue) {
    const endDate = parseAppDate(endDateValue);
    if (!endDate) return 'active';
    const daysLeft = Math.ceil((endDate - parseAppDate(new Date())) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 30) return 'expiring';
    return 'active';
  }

  const getDashboardStats = () => {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => getRoomOccupiedSlots(room) > 0).length;
    const availableRooms = rooms.filter(room =>
      getRoomOccupiedSlots(room) === 0 && room.status !== 'under_maintenance'
    ).length;
    const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0);
    const unpaidInvoices = invoices.filter(i => getInvoiceStatus(i) !== 'paid').length;
    const totalTenants = tenants.length;

    return {
      totalRooms,
      occupiedRooms,
      availableRooms,
      totalRevenue,
      unpaidInvoices,
      totalTenants,
    };
  };

  const getExpiringContracts = (days = 30) => {
    const today = parseAppDate(new Date());
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    return contracts.filter(contract => {
      const endDate = parseAppDate(contract.endDate);
      if (!endDate) return false;
      return endDate >= today && endDate <= futureDate;
    });
  };

  const getOverdueInvoices = () => {
    const today = new Date();
    return invoices.filter(invoice => {
      return getInvoiceStatus(invoice) === 'overdue';
    });
  };

  const value = {
    // Data
    rooms,
    tenants,
    invoices,
    contracts,
    users,
    isLoading,

    // Room operations
    addRoom,
    updateRoom,
    deleteRoom,

    // Tenant operations
    addTenant,
    updateTenant,
    deleteTenant,

    // Invoice operations
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markInvoiceAsPaid,
    markInvoiceAsUnpaid,

    // Contract operations
    addContract,
    updateContract,
    deleteContract,
    renewContract,

    // User operations
    updateUserRole,
    toggleUserStatus,

    // Utility functions
    getRoomById,
    getTenantById,
    getInvoicesByTenant,
    getContractsByTenant,
    getRoomOccupiedSlots,
    getRoomAvailableSlots,
    getAvailableRooms,
    getDashboardStats,
    getExpiringContracts,
    getOverdueInvoices,

    // Data loading
    loadData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
