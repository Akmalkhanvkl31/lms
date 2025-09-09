import React, { useState } from 'react';
import { FaUser, FaBell, FaShieldAlt, FaCog } from 'react-icons/fa';
import { useSettings } from './settings/hooks';
import { ProfileSection, NotificationsSection, SecuritySection, SystemSection } from './settings/components';
import './Settings.css';

const tabs = [
  { id: 'profile', label: 'Profile', icon: FaUser, component: ProfileSection },
  { id: 'notifications', label: 'Notifications', icon: FaBell, component: NotificationsSection },
  { id: 'security', label: 'Security', icon: FaShieldAlt, component: SecuritySection },
  { id: 'system', label: 'System', icon: FaCog, component: SystemSection }
];

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const { settings, loading, message, handleInputChange, handleSave } = useSettings();

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and system preferences</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-content">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="tab-icon" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-main">
          {ActiveComponent && (
            <ActiveComponent
              settings={settings}
              loading={loading}
              handleInputChange={handleInputChange}
              handleSave={handleSave}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
