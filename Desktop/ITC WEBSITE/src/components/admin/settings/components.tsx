import React from 'react';
import { FaSave } from 'react-icons/fa';
import { Settings } from './types';

interface SettingsSectionProps {
  settings: Settings;
  loading: boolean;
  handleInputChange: (section: keyof Settings, field: string, value: string | boolean | number) => void;
  handleSave: (section: keyof Settings) => void;
}

export const ProfileSection: React.FC<SettingsSectionProps> = ({ settings, loading, handleInputChange, handleSave }) => (
  <div className="settings-section">
    <h2 className="section-title">Profile Information</h2>
    <div className="form-grid">
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={settings.profile.name}
          onChange={(e) => handleInputChange('profile', 'name', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={settings.profile.email}
          onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
          className="form-input"
          disabled
        />
      </div>
      <div className="form-group">
        <label>Position</label>
        <input
          type="text"
          value={settings.profile.position}
          onChange={(e) => handleInputChange('profile', 'position', e.target.value)}
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={settings.profile.phone}
          onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
          className="form-input"
        />
      </div>
    </div>
    <button 
      className="btn-primary" 
      onClick={() => handleSave('profile')}
      disabled={loading}
    >
      <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
);

export const NotificationsSection: React.FC<SettingsSectionProps> = ({ settings, loading, handleInputChange, handleSave }) => (
    <div className="settings-section">
    <h2 className="section-title">Notification Preferences</h2>
    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={settings.notifications.emailNotifications}
          onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
        />
        Email Notifications
      </label>
      <p className="help-text">Receive general email notifications</p>
    </div>
    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={settings.notifications.assignmentReminders}
          onChange={(e) => handleInputChange('notifications', 'assignmentReminders', e.target.checked)}
        />
        Assignment Reminders
      </label>
      <p className="help-text">Get notified about assignment due dates</p>
    </div>
    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={settings.notifications.studentRegistrations}
          onChange={(e) => handleInputChange('notifications', 'studentRegistrations', e.target.checked)}
        />
        Student Registrations
      </label>
      <p className="help-text">Notifications for new student registrations</p>
    </div>
    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={settings.notifications.weeklyReports}
          onChange={(e) => handleInputChange('notifications', 'weeklyReports', e.target.checked)}
        />
        Weekly Reports
      </label>
      <p className="help-text">Receive weekly progress reports</p>
    </div>
    <button 
      className="btn-primary" 
      onClick={() => handleSave('notifications')}
      disabled={loading}
    >
      <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
);

export const SecuritySection: React.FC<SettingsSectionProps> = ({ settings, loading, handleInputChange, handleSave }) => (
    <div className="settings-section">
    <h2 className="section-title">Security Settings</h2>
    <div className="form-grid">
      <div className="form-group">
        <label>Current Password</label>
        <input
          type="password"
          value={settings.security.currentPassword}
          onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
          className="form-input"
          placeholder="Enter current password"
        />
      </div>
      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          value={settings.security.newPassword}
          onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
          className="form-input"
          placeholder="Enter new password"
        />
      </div>
      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={settings.security.confirmPassword}
          onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
          className="form-input"
          placeholder="Confirm new password"
        />
      </div>
    </div>
    <button 
      className="btn-primary" 
      onClick={() => handleSave('security')}
      disabled={loading || !settings.security.newPassword}
    >
      <FaSave /> {loading ? 'Updating...' : 'Update Password'}
    </button>
  </div>
);

export const SystemSection: React.FC<SettingsSectionProps> = ({ settings, loading, handleInputChange, handleSave }) => (
    <div className="settings-section">
    <h2 className="section-title">System Preferences</h2>
    <div className="form-grid">
      <div className="form-group">
        <label>Timezone</label>
        <select
          value={settings.system.timezone}
          onChange={(e) => handleInputChange('system', 'timezone', e.target.value)}
          className="form-input"
        >
          <option value="UTC">UTC</option>
          <option value="Asia/Kolkata">India Standard Time</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="Europe/London">British Time</option>
        </select>
      </div>
      <div className="form-group">
        <label>Date Format</label>
        <select
          value={settings.system.dateFormat}
          onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
          className="form-input"
        >
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
      <div className="form-group">
        <label>Default Batch Size</label>
        <input
          type="number"
          value={settings.system.defaultBatchSize}
          onChange={(e) => handleInputChange('system', 'defaultBatchSize', parseInt(e.target.value))}
          className="form-input"
          min="1"
          max="100"
        />
      </div>
    </div>
    <div className="form-group">
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={settings.system.autoApproveStudents}
          onChange={(e) => handleInputChange('system', 'autoApproveStudents', e.target.checked)}
        />
        Auto-approve Student Registrations
      </label>
      <p className="help-text">Automatically approve new student registrations</p>
    </div>
    <button 
      className="btn-primary" 
      onClick={() => handleSave('system')}
      disabled={loading}
    >
      <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
    </button>
  </div>
);
