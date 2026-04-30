import React, { createContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fileStorage } from '../services/fileStorage';

export const AuthContext = createContext();

const USERS_STORAGE_KEY = 'sanctuary_users';

const normalizeSystemUser = (userData) => {
  if (!userData) return null;
  if (userData.email === 'admin@rental.com') {
    return { ...userData, id: 1, name: 'Quản trị viên' };
  }
  if (userData.email === 'manager@rental.com') {
    return { ...userData, id: 2, name: 'Quản lý viên' };
  }
  return userData;
};

const getManagedUsers = async () => {
  const [fileData, usersData] = await Promise.all([
    fileStorage.getData(),
    AsyncStorage.getItem(USERS_STORAGE_KEY),
  ]);

  if (Array.isArray(fileData?.users) && fileData.users.length > 0) {
    return fileData.users;
  }

  return usersData ? JSON.parse(usersData) : [];
};

const saveManagedUsers = async (users) => {
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  await fileStorage.patchData({ users });
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            userRole: action.role,
            userData: action.userData,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userRole: action.role,
            userData: action.userData,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            userRole: action.role,
            userData: action.userData,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            userRole: null,
            userData: null,
          };
        case 'SET_ERROR':
          return {
            ...prevState,
            error: action.error,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      userRole: null,
      userData: null,
      error: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        const userData = await AsyncStorage.getItem('userData');

        if (token) {
          const parsedUserData = normalizeSystemUser(userData ? JSON.parse(userData) : null);
          if (parsedUserData) {
            await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
          }

          dispatch({
            type: 'RESTORE_TOKEN',
            token,
            role,
            userData: parsedUserData,
          });
        } else {
          dispatch({ type: 'RESTORE_TOKEN', token: null, role: null, userData: null });
        }
      } catch (e) {
        console.log('Failed to restore token:', e);
        dispatch({ type: 'RESTORE_TOKEN', token: null, role: null, userData: null });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (email, password) => {
        try {
          // Mock authentication
          const mockUsers = {
            'admin@rental.com': {
              password: 'admin123',
              role: 'admin',
              name: 'Quản trị viên',
              id: 1,
            },
            'manager@rental.com': {
              password: 'manager123',
              role: 'manager',
              name: 'Quản lý viên',
              id: 2,
            },
           
          };

          const user = mockUsers[email];
          if (!user || user.password !== password) {
            dispatch({
              type: 'SET_ERROR',
              error: 'Email hoặc mật khẩu không đúng',
            });
            return false;
          }

          const managedUsers = await getManagedUsers();
          const managedUser = managedUsers.find(item => item.email === email || item.id === user.id);

          if (managedUser?.status === 'locked') {
            dispatch({
              type: 'SET_ERROR',
              error: 'Tài khoản đã bị khóa',
            });
            return false;
          }

          const userData = {
            id: user.id,
            name: user.name,
            email,
            role: managedUser?.role || user.role,
          };

          await AsyncStorage.setItem('userToken', 'fake-token-' + Date.now());
          await AsyncStorage.setItem('userRole', userData.role);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));

          dispatch({
            type: 'SIGN_IN',
            token: 'fake-token-' + Date.now(),
            role: userData.role,
            userData,
          });

          return true;
        } catch (e) {
          dispatch({
            type: 'SET_ERROR',
            error: 'Lỗi đăng nhập',
          });
          return false;
        }
      },
      signUp: async (email, password, name, role = 'tenant') => {
        try {
          const userData = {
            id: Date.now(),
            name,
            email,
            role,
          };

          const managedUsers = await getManagedUsers();
          const updatedUsers = [
            ...managedUsers.filter(user => user.email !== email),
            { id: userData.id, name, email, role, status: 'active' },
          ];

          await AsyncStorage.setItem('userToken', 'fake-token-' + Date.now());
          await AsyncStorage.setItem('userRole', role);
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          await saveManagedUsers(updatedUsers);

          dispatch({
            type: 'SIGN_UP',
            token: 'fake-token-' + Date.now(),
            role,
            userData,
          });

          return true;
        } catch (e) {
          dispatch({
            type: 'SET_ERROR',
            error: 'Lỗi đăng ký',
          });
          return false;
        }
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userRole');
          await AsyncStorage.removeItem('userData');
          dispatch({ type: 'SIGN_OUT' });
        } catch (e) {
          console.log('Error signing out:', e);
        }
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={{ ...state, ...authContext }}>
      {children}
    </AuthContext.Provider>
  );
};
