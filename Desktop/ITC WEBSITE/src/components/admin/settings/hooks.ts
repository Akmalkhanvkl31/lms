import { useState, useEffect, useCallback } from 'react';
import { Settings, Message } from './types';
import { fetchUserProfile, updateUserProfile, updateUserPassword } from './api';

const initialSettings: Settings = {
  profile: { name: '', email: '', position: '', phone: '' },
  notifications: {
    emailNotifications: true,
    assignmentReminders: true,
    studentRegistrations: true,
    weeklyReports: false,
  },
  security: { currentPassword: '', newPassword: '', confirmPassword: '' },
  system: {
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    defaultBatchSize: 25,
    autoApproveStudents: false,
  },
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setSettings(prev => ({ ...prev, profile: userProfile }));
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    loadUserProfile();
  }, []);

  const handleInputChange = useCallback((section: keyof Settings, field: string, value: string | boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  }, []);

  const handleSave = useCallback(async (section: keyof Settings) => {
    setLoading(true);
    try {
      if (section === 'profile') {
        await updateUserProfile(settings.profile);
      } else if (section === 'security') {
        await updateUserPassword(settings.security);
        setSettings(prev => ({
          ...prev,
          security: { currentPassword: '', newPassword: '', confirmPassword: '' },
        }));
      }
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  }, [settings]);

  return { settings, loading, message, handleInputChange, handleSave };
};
