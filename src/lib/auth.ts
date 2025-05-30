import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string; // Storing first name here
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
      console.log('authService.signUp: Starting signup process...');
      
      // Optional: Validate email domain if still needed
      if (!email.endsWith('@doonschool.com')) {
        console.log('authService.signUp: Invalid email domain');
        return {
          success: false,
          error: 'Please use your Doon School email address'
        };
      }
      console.log('authService.signUp: Email domain valid.');

      // Use Supabase Auth signUp function
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Include house and full name in user_metadata during signup
          data: { house: house, full_name: name } 
        }
      });
      console.log('authService.signUp: Supabase Auth signUp response - data:', authData, 'error:', authError);

      if (authError) {
        console.error('authService.signUp: Supabase Auth error:', authError);
        // Provide more user-friendly error messages for common issues
        if (authError.message.includes('already registered')) {
           return { success: false, error: 'This email is already registered.' };
        } else if (authError.message.includes('Password should be')) {
           return { success: false, error: authError.message };
        }
        return { success: false, error: authError.message || 'Failed to create account with Supabase Auth.' };
      }

      // After successful Auth signup, create the user profile in the 'Users' table
      // Supabase's signUp function might return user data immediately or after email confirmation, depending on settings.
      // We should check if user is returned before creating profile.
      if (authData.user) {
         console.log('authService.signUp: Supabase Auth user created, attempting to create profile...');
         const { error: profileError } = await supabase
           .from('Users')
           .insert({
             id: authData.user.id, // Link profile to Supabase Auth user ID
             name: name.split(' ')[0], // Store only the first name in the profile 'name' field
             email: email,
             house: house,
             budget: 1000, // Set initial budget
             fantasy_points: 0, // Set initial points
             team_created: false,
             captain_id: null,
             last_team_update: null
           });

         if (profileError) {
           console.error('authService.signUp: User profile creation error:', profileError);
           // IMPORTANT: If profile creation fails, you may want to delete the user created in Supabase Auth
           // to avoid orphaned auth users. This would require Admin privileges or a Supabase Function.
           return { success: false, error: 'Failed to create user profile.' };
         }
         console.log('authService.signUp: User profile created successfully.');
         
         // Supabase sends a verification email by default if not turned off in Auth settings.
         // Inform the user to check their email.
         return { success: true };

      } else if (authData.session === null) {
           // This case typically happens when email confirmation is required.
           // The user is created in auth.users, but no session is returned immediately.
           console.log('authService.signUp: Supabase Auth signup successful, email confirmation required.');
           return { success: true }; // Indicate that the signup *initiation* was successful, verification needed.

      } else {
          // Unexpected scenario
          console.error('authService.signUp: Supabase Auth signup returned unexpected data:', authData);
          return { success: false, error: 'An unexpected response received after signup.' };
      }

    } catch (error: any) {
      console.error('authService.signUp: Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during signup.'
      };
    }
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('authService.signIn: Starting signin process...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log('authService.signIn: Supabase Auth signIn response - data:', data, 'error:', error);

      if (error) {
        console.error('authService.signIn: Supabase Auth error:', error);
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address before logging in.' };
        }
        return { success: false, error: error.message || 'Invalid login credentials.' };
      }

      if (!data.user) {
        console.error('authService.signIn: No user data returned');
        return { success: false, error: 'No user data received after successful login.' };
      }

      // Immediately try to fetch the user profile to verify RLS is working
      const profile = await this.getUserProfile(data.user.id);
      console.log('authService.signIn: Initial profile fetch result:', profile);

      if (!profile) {
        console.error('authService.signIn: Failed to fetch user profile after login');
        return { success: false, error: 'Failed to load user profile. Please try again.' };
      }

      return { success: true };
    } catch (error: any) {
      console.error('authService.signIn: Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during signin.'
      };
    }
  },

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('authService.signOut: Starting signout process...');
      const { error } = await supabase.auth.signOut();
      console.log('authService.signOut: Supabase Auth signOut response - error:', error);

      if (error) {
        console.error('authService.signOut: Supabase Auth error:', error);
        // We return success: true even on some errors here to force client-side logout if Supabase is unresponsive
        // but log the error. A more robust approach might check specific error types.
        return { success: false, error: error.message || 'Failed to sign out from Supabase.' };
      }

      console.log('authService.signOut: User signed out successfully.');
      return { success: true };
    } catch (error: any) {
      console.error('authService.signOut: Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during signout.'
      };
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('authService.getUserProfile: Fetching profile for userId:', userId);
      const { data, error } = await supabase
        .from('Users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('authService.getUserProfile: Profile fetch response - data:', data, 'error:', error);

      if (error) {
        console.error('authService.getUserProfile: Supabase error fetching profile:', error);
        // Log the specific error code and message if available
        console.error('authService.getUserProfile: Supabase error details - code:', error.code, 'message:', error.message, 'details:', error.details, 'hint:', error.hint);
        
        if (error.code === 'PGRST301') {
          console.error('authService.getUserProfile: RLS policy error - access denied');
        }
        return null;
      }

      if (!data) {
        console.log('authService.getUserProfile: No user profile found for userId:', userId);
        return null;
      }

      console.log('authService.getUserProfile: Profile fetched successfully:', data);
      return data as UserProfile;
    } catch (error: any) {
      console.error('authService.getUserProfile: Unexpected error:', error);
      console.error('authService.getUserProfile: Unexpected error details:', error.message);
      return null;
    }
  },

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('authService.updateUserProfile: Updating profile for userId:', userId, 'updates:', updates);
       // Ensure your RLS policy allows authenticated users to update their own rows in the 'Users' table.
      const { error } = await supabase
        .from('Users')
        .update(updates)
        .eq('id', userId);
      console.log('authService.updateUserProfile: Update response - error:', error);

      if (error) {
        console.error('authService.updateUserProfile: Supabase error updating profile:', error);
        return { success: false, error: error.message || 'Failed to update profile.' };
      }

      console.log('authService.updateUserProfile: Profile updated successfully.');
      return { success: true };
    } catch (error: any) {
      console.error('authService.updateUserProfile: Unexpected error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during profile update.'
      };
    }
  }
}; 