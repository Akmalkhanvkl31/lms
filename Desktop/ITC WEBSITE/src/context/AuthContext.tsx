import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentRegistrationData } from '@/types';
import { supabase } from '../supabaseClient';
import { Session, UserAttributes } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (studentData: StudentRegistrationData) => Promise<boolean>;
  isAuthenticated: boolean;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  updateUser: (attributes: UserAttributes) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getUserProfile = async (user: User) => {
    // First, get the user's role from the 'users' table
    const { data: userRoleData, error: userRoleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userRoleError) {
      console.error('Error fetching user role:', userRoleError);
      return { ...user };
    }

    const role = userRoleData?.role;

    if (role === 'admin') {
      // If the user is an admin, fetch their profile from the 'admins' table
      const { data: adminProfile, error: adminError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      if (adminError || !adminProfile) {
        console.warn(`Admin profile not found for user ${user.id}.`);
        return { ...user, ...userRoleData }; // Return basic user data
      }
      return { ...user, ...userRoleData, ...adminProfile };

    } else if (role === 'student') {
      // If the user is a student, fetch their profile from the 'students' table
      const { data: studentProfile, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .single();

      if (studentError || !studentProfile) {
        console.warn(`Student profile not found for user ${user.id}.`);
        return { ...user, ...userRoleData }; // Return basic user data
      }
      return { ...user, ...userRoleData, ...studentProfile };
    }

    // Fallback for users with no specific role or other roles
    return { ...user, ...userRoleData };
  };
  

  useEffect(() => {
    const getSessionAndProfile = async (session: Session | null) => {
      setIsLoading(true);
      if (session?.user) {
        const profile = await getUserProfile(session.user as User);
        setUser(profile as User);
      } else {
        setUser(null);
      }
      setSession(session);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };

    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      getSessionAndProfile(data.session);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        getSessionAndProfile(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return false;
    
    if (data.session?.user) {
      const profile = await getUserProfile(data.session.user as User);
      setUser(profile as User);
    }
    
    return !!data.session;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const register = async (studentData: StudentRegistrationData): Promise<boolean> => {
    const { email, password, fullName, ...rest } = studentData;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Registration error:', signUpError);
      return false;
    }

    if (signUpData.user) {
      const { error: userInsertError } = await supabase
        .from('users')
        .insert([{ id: signUpData.user.id, full_name: fullName, role: 'student' }]);

      if (userInsertError) {
        console.error('Error creating user profile:', userInsertError);
        return false;
      }

      const { error: studentInsertError } = await supabase
        .from('students')
        .insert([{ id: signUpData.user.id, ...rest }]);

      if (studentInsertError) {
        console.error('Error creating student profile:', studentInsertError);
        return false;
      }
    }

    return !!signUpData.session;
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  const updateUser = async (attributes: UserAttributes): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser(attributes);
    return !error;
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, register, isAuthenticated, resetPasswordForEmail, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
