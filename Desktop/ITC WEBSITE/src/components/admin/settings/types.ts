export interface ProfileSettings {
  name: string;
  email: string;
  position: string;
  phone: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  assignmentReminders: boolean;
  studentRegistrations: boolean;
  weeklyReports: boolean;
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SystemSettings {
  timezone: string;
  dateFormat: string;
  defaultBatchSize: number;
  autoApproveStudents: boolean;
}

export interface Settings {
  profile: ProfileSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  system: SystemSettings;
}

export interface Message {
  type: 'success' | 'error';
  text: string;
}
