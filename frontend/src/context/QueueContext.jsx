import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import confetti from 'canvas-confetti';
import { announceToken } from '../utils/audio';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast, fetchNotifications } = useNotifications();

  const [departments, setDepartments] = useState([]);
  const [counters, setCounters] = useState([]);
  const [liveQueue, setLiveQueue] = useState(null);
  const [activeToken, setActiveToken] = useState(null);
  const [userTokens, setUserTokens] = useState([]);
  const [allTokens, setAllTokens] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Tracking previous state to trigger sound & toast alerts when turn is near
  const prevNearRef = useRef(false);
  const prevServingRef = useRef(null);

  const fetchLiveStatus = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsRefreshing(true);
    try {
      // 1. Fetch live queue overview
      const liveData = await api.getLiveQueue();
      setLiveQueue(liveData);

      if (liveData?.counters) {
        setCounters(liveData.counters);
      }

      // Check student active token and near-turn notifications
      if (liveData?.studentStatus?.hasActiveToken) {
        const studentInfo = liveData.studentStatus;
        setActiveToken(studentInfo.token);

        // Turn is approaching notification
        if (studentInfo.isNearTurn && !prevNearRef.current) {
          showToast(
            `Token ${studentInfo.token.tokenNumber}: You are near the front of the queue! Proceed to Counter ${studentInfo.token.counter}.`,
            'alert',
            '🔔 Your turn is near!'
          );
          prevNearRef.current = true;
        }

        // Active calling
        if (studentInfo.token.status === 'CALLING' && prevServingRef.current !== studentInfo.token.tokenNumber) {
          showToast(
            `Token ${studentInfo.token.tokenNumber} is NOW SERVING at Counter ${studentInfo.token.counter}!`,
            'alert',
            '📢 Attention Required'
          );
          prevServingRef.current = studentInfo.token.tokenNumber;
          try {
            confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
          } catch (e) {}
        }
      } else {
        setActiveToken(null);
        prevNearRef.current = false;
        prevServingRef.current = null;
      }

      // 2. Fetch departments
      const depts = await api.getDepartments();
      setDepartments(depts);

      // 3. If student, fetch their history
      if (isAuthenticated && !isAdmin) {
        const myToks = await api.getUserTokens();
        setUserTokens(myToks);
      }

      // 4. If admin, fetch all tokens
      if (isAdmin) {
        const allToks = await api.getAllTokens();
        setAllTokens(allToks);
        const cntrs = await api.getCounters();
        setCounters(cntrs);
      }

      // Refresh notifications drawer
      if (isAuthenticated) {
        fetchNotifications();
      }
    } catch (err) {
      console.warn("Queue status fetch failed:", err.message);
    } finally {
      if (!isBackground) setIsRefreshing(false);
    }
  }, [isAuthenticated, isAdmin, showToast, fetchNotifications]);

  // Initial load
  useEffect(() => {
    fetchLiveStatus(false);
  }, [fetchLiveStatus]);

  // Real-time polling timer (every 6 seconds)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveStatus(true);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLiveStatus]);

  // Actions
  const joinQueue = async (departmentId, service) => {
    try {
      const newToken = await api.joinQueue(departmentId, service);
      showToast(`Token ${newToken.tokenNumber} assigned successfully!`, 'info', 'Queue Joined');
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      await fetchLiveStatus(false);
      return newToken;
    } catch (err) {
      showToast(err.message, 'warning', 'Unable to Join');
      throw err;
    }
  };

  const cancelToken = async (tokenId) => {
    try {
      await api.cancelToken(tokenId);
      showToast('Your token was cancelled.', 'info', 'Token Cancelled');
      await fetchLiveStatus(false);
    } catch (err) {
      showToast(err.message, 'warning', 'Cancellation Failed');
      throw err;
    }
  };

  // Admin Actions
  const callNext = async (departmentId, counterNumber) => {
    try {
      const res = await api.callNext(departmentId, counterNumber);
      if (res.data) {
        showToast(`Token ${res.data.tokenNumber} called to Counter ${res.data.counter}.`, 'alert', 'Token Called');
        announceToken(res.data.tokenNumber, res.data.counter);
      } else {
        showToast('No more waiting tokens in this queue.', 'info', 'Queue Empty');
      }
      await fetchLiveStatus(false);
      return res.data;
    } catch (err) {
      showToast(err.message, 'warning', 'Action Failed');
      throw err;
    }
  };

  const completeToken = async (tokenId) => {
    try {
      const res = await api.completeToken(tokenId);
      showToast(`Token ${res.data.tokenNumber} completed.`, 'info', 'Completed');
      await fetchLiveStatus(false);
      return res.data;
    } catch (err) {
      showToast(err.message, 'warning', 'Action Failed');
      throw err;
    }
  };

  const skipToken = async (tokenId, autoNext = true) => {
    try {
      const res = await api.skipToken(tokenId, autoNext);
      showToast(
        `Token ${res.data.skipped.tokenNumber} marked skipped. ${res.data.nextCalled ? `Calling next: ${res.data.nextCalled.tokenNumber}` : ''}`,
        'warning',
        'Token Skipped'
      );
      if (res.data.nextCalled) {
        announceToken(res.data.nextCalled.tokenNumber, res.data.nextCalled.counter);
      }
      await fetchLiveStatus(false);
      return res.data;
    } catch (err) {
      showToast(err.message, 'warning', 'Action Failed');
      throw err;
    }
  };

  const recallToken = async (tokenId) => {
    try {
      const res = await api.recallToken(tokenId);
      showToast(`Token ${res.data.tokenNumber} recalled to Counter ${res.data.counter}!`, 'alert', 'Token Recalled');
      announceToken(res.data.tokenNumber, res.data.counter);
      await fetchLiveStatus(false);
      return res.data;
    } catch (err) {
      showToast(err.message, 'warning', 'Action Failed');
      throw err;
    }
  };

  const transferToken = async (tokenId, transferData) => {
    try {
      const res = await api.transferToken(tokenId, transferData);
      showToast(res.message || 'Token transferred successfully', 'info', 'Transferred');
      await fetchLiveStatus(false);
      return res.data;
    } catch (err) {
      showToast(err.message, 'warning', 'Transfer Failed');
      throw err;
    }
  };

  const updateCounter = async (counterId, updates) => {
    try {
      const res = await api.updateCounter(counterId, updates);
      showToast(`Counter updated successfully`, 'info', 'Updated');
      await fetchLiveStatus(false);
      return res;
    } catch (err) {
      showToast(err.message, 'warning', 'Update Failed');
      throw err;
    }
  };

  const updateDepartment = async (deptId, updates) => {
    try {
      const res = await api.updateDepartment(deptId, updates);
      showToast(`Service configuration updated`, 'info', 'Updated');
      await fetchLiveStatus(false);
      return res;
    } catch (err) {
      showToast(err.message, 'warning', 'Update Failed');
      throw err;
    }
  };

  const createDepartment = async (deptData) => {
    try {
      const res = await api.createDepartment(deptData);
      showToast(`Service added successfully`, 'info', 'Created');
      await fetchLiveStatus(false);
      return res;
    } catch (err) {
      showToast(err.message, 'warning', 'Failed to Add Service');
      throw err;
    }
  };

  const rateToken = async (tokenId, rating, comment) => {
    try {
      const res = await api.rateToken(tokenId, rating, comment);
      showToast(`Thank you for rating your service experience!`, 'info', 'Rating Saved');
      await fetchLiveStatus(false);
      return res;
    } catch (err) {
      showToast(err.message, 'warning', 'Rating Failed');
      throw err;
    }
  };

  return (
    <QueueContext.Provider
      value={{
        departments,
        counters,
        liveQueue,
        activeToken,
        userTokens,
        allTokens,
        isRefreshing,
        autoRefresh,
        setAutoRefresh,
        refreshQueue: () => fetchLiveStatus(false),
        joinQueue,
        cancelToken,
        callNext,
        completeToken,
        skipToken,
        recallToken,
        transferToken,
        updateCounter,
        updateDepartment,
        createDepartment,
        rateToken
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
