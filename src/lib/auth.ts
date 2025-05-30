import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  house: string;
  budget: number;
  fantasy_points: number;
  team_created: boolean;
  captain_id: number | null;
  last_team_update: string | null;
}

export const authService = {
  async signUp(email: string, password: string, name: string, house: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('authService.signUp: Starting signup process...', { email, name, house });
      
      if (!email.endsWith('@doonschool.com')) {
        return {
          success: false,
          error: 'Please use your Doon School email address'
        };
      }

      // First, check if the email already exists
      const { data: existingUser } = await supabase
        .from('Users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return {
          success: false,
          error: 'This email is already registered'
        };
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            house: house
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { 
          success: false, 
          error: authError.message 
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'Failed to create user account'
        };
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('Users')
        .insert({
          id: authData.user.id,
          name: name,
          email: email,
          house: house,
          budget: 1000,
          fantasy_points: 0,
          team_created: false
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        return {
          success: false,
          error: 'Failed to create user profile'
        };
      }

      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }

      if (!data.user) {
        return { 
          success: false, 
          error: 'No user data received' 
        };
      }

      const profile = await this.getUserProfile(data.user.id);
      
      if (!profile) {
        return { 
          success: false, 
          error: 'Failed to load user profile' 
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  },

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { 
          success: false, 
          error: error.message 
        };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('Users')
        .update(updates)
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      return false;
    }
  }
};