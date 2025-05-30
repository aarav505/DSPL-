import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { authService, UserProfile } from '@/lib/auth';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userProfile: UserProfile | null;
  signUp: (email: string, password: string, name: string, house: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthContext useEffect: Setting up auth state listener...');
    
    // Clear any existing invalid session on mount
    const clearInvalidSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (!profile) {
          console.log('AuthContext: Clearing invalid session on mount');
          await supabase.auth.signOut();
        }
      }
    };
    
    clearInvalidSession();

    // Set up auth state listener to react to changes in auth status
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed - Event:', event, 'Session:', session);
        
        // Always clear states first
        setSession(null);
        setUser(null);
        setUserProfile(null);
        setLoading(true);
        
        if (session?.user) {
          console.log('AuthContext: Auth state changed - User detected, fetching profile...');
          const profile = await fetchUserProfile(session.user.id);
          
          if (profile) {
            console.log('AuthContext: Profile found, setting user session');
            setSession(session);
            setUser(session.user);
            setUserProfile(profile);
            
            // If this was a sign in event, navigate to my-team
            if (event === 'SIGNED_IN') {
              navigate('/my-team');
            }
          } else {
            console.log('AuthContext: No profile found, signing out');
            await supabase.auth.signOut();
            toast({
              title: "Session Error",
              description: "Your session was invalid. Please log in again.",
              variant: "destructive",
            });
            navigate('/login');
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthContext: User signed out, redirecting to home');
          navigate('/');
        }
        
        setLoading(false);
      }
    );

    // Fetch initial session
    const getInitialSession = async () => {
      console.log('AuthContext: Attempting to get initial session...');
      setLoading(true);
      
      const timeoutPromise = new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error('Initial session fetch timed out')), 10000) // Timeout after 10 seconds
      );

      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          timeoutPromise
        ]);

        // Check if the result is an error from the timeout
        if (result instanceof Error) {
             throw result; // Re-throw the timeout error to be caught below
        }

        // If not a timeout error, it should be the session data structure
        const { data: { session }, error } = result;

        console.log('AuthContext: Initial session response - session:', session, 'error:', error);

        if (error) {
          console.error('AuthContext: Error getting initial session:', error);
          await supabase.auth.signOut();
          return;
        }

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setSession(session);
            setUser(session.user);
            setUserProfile(profile);
          } else {
            await supabase.auth.signOut();
            toast({
              title: "Session Error",
              description: "Your session was invalid. Please log in again.",
              variant: "destructive",
            });
          }
        }
      } catch (error: any) {
        console.error('AuthContext: Error in getInitialSession:', error);
        // If timeout or other error occurs during initial fetch, sign out and notify
        await supabase.auth.signOut();
         toast({
           title: "Session Error",
           description: "Could not load session. Please try again.",
           variant: "destructive",
         });
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('AuthContext useEffect: Cleaning up auth state listener subscription.');
      subscription.unsubscribe();
    };
  }, [navigate]); // Add navigate to dependencies

  const fetchUserProfile = async (userId: string) => {
    console.log('AuthContext.fetchUserProfile: Fetching user profile for userId:', userId);
    try {
      const profile = await authService.getUserProfile(userId);
      console.log('AuthContext.fetchUserProfile: User profile fetched response:', profile);
      
      if (!profile) {
        console.error('AuthContext.fetchUserProfile: No profile found for user');
        return null;
      }
      
      return profile;
    } catch (error) {
      console.error('AuthContext.fetchUserProfile: Error fetching profile:', error);
      return null;
    }
  };

  const signUp = async (email: string, password: string, name: string, house: string) => {
    console.log('AuthContext.signUp: Initiating signup...');
    setLoading(true); // Start loading
    const result = await authService.signUp(email, password, name, house);

    if (!result.success) {
      toast({
        title: "Signup failed",
        description: result.error || "An unexpected error occurred during signup.",
        variant: "destructive",
      });
    } else {
       toast({
        title: "Account created successfully!",
        description: "Please check your email for a verification link to activate your account.",
      });
      // No navigation here, let the user manually go to login after seeing the toast.
      // navigate('/login'); // Removed automatic navigation
    }
    setLoading(false); // End loading regardless of success/failure
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext.signIn: Initiating signin...');
    setLoading(true);
    
    try {
      const result = await authService.signIn(email, password);
      
      if (!result.success) {
        toast({
          title: "Login failed",
          description: result.error || "An unexpected error occurred during login.",
          variant: "destructive",
        });
      }
      // Navigation is now handled by the auth state change listener
    } catch (error) {
      console.error('AuthContext.signIn: Unexpected error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    console.log('AuthContext.signOut: Initiating signout...');
    setLoading(true); // Start loading
    
    // Clear local state immediately for better responsiveness
    setUser(null);
    setSession(null);
    setUserProfile(null);

    const result = await authService.signOut();

    if (!result.success) {
       console.error('AuthContext.signOut: Supabase signOut failed:', result.error);
       toast({
        title: "Logout failed",
        description: result.error || "An unexpected error occurred during logout.",
        variant: "destructive",
      });
    } else {
        // Navigation to / is now handled by the onAuthStateChange listener when SIGNED_OUT event occurs
       // navigate('/'); // Removed automatic navigation
    }

    setLoading(false); // End loading
  };

  const refreshUserProfile = async () => {
     console.log('AuthContext.refreshUserProfile: Refreshing user profile...');
    if (user) {
      setLoading(true); // Indicate loading while refreshing profile
      await fetchUserProfile(user.id);
      setLoading(false); // End loading
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, userProfile, signUp, signIn, signOut, refreshUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
