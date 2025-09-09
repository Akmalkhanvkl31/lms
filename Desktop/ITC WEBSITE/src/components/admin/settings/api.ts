import { supabase } from '../../../supabaseClient';
import { ProfileSettings, SecuritySettings } from './types';

export const fetchUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { data: profile, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;

  return {
    name: profile.full_name || '',
    email: user.email || '',
    position: profile.position || '',
    phone: profile.phone_number || ''
  };
};

export const updateUserProfile = async (profile: ProfileSettings) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  const { error } = await supabase
    .from('admins')
    .update({
      full_name: profile.name,
      position: profile.position,
      phone_number: profile.phone
    })
    .eq('id', user.id);

  if (error) throw error;
};

export const updateUserPassword = async (security: SecuritySettings) => {
  if (security.newPassword !== security.confirmPassword) {
    throw new Error('New passwords do not match');
  }
  
  if (security.newPassword) {
    const { error } = await supabase.auth.updateUser({
      password: security.newPassword
    });
    
    if (error) throw error;
  }
};
