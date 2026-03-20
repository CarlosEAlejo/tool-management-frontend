import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getApiErrorMessage } from '../../../entities/tool/model';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../../../services/api/authService';
import {
  clearStoredSession,
  getRefreshToken,
  refreshSession,
  setAuthFailureHandler,
  storeSessionTokens,
} from '../../../services/api/client';

const AuthContext = createContext(null);

const applyAuthResult = (result, setUser) => {
  storeSessionTokens(result);
  setUser(result.user);
  return result.user;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setAuthFailureHandler(() => {
      setUser(null);
    });

    const initialize = async () => {
      const persistedRefreshToken = getRefreshToken();
      if (!persistedRefreshToken) {
        setInitializing(false);
        return;
      }

      try {
        await refreshSession();
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (_error) {
        clearStoredSession();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    initialize();

    return () => {
      setAuthFailureHandler(null);
    };
  }, []);

  const login = async (credentials) => {
    try {
      const result = await loginUser(credentials);
      return applyAuthResult(result, setUser);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'No se pudo iniciar sesion'));
    }
  };

  const register = async (payload) => {
    try {
      const result = await registerUser(payload);
      return applyAuthResult(result, setUser);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'No se pudo completar el registro'));
    }
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } finally {
      clearStoredSession();
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    return currentUser;
  };

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
