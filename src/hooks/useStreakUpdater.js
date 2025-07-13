// src/hooks/useStreakUpdater.js
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import updateStreak from '../utils/updateStreak';

export default function useStreakUpdater() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      updateStreak(user.uid);
    }
  }, [user?.uid]);
}