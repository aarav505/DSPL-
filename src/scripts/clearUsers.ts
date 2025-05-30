import { supabase } from '@/lib/supabase';

async function clearAllUsers() {
  try {
    // First, clear the user_teams table
    const { error: teamsError } = await supabase
      .from('user_teams')
      .delete()
      .not('id', 'is', null);

    if (teamsError) {
      console.error('Error clearing user_teams table:', teamsError);
      return;
    }

    // Then clear the Users table
    const { error: usersError } = await supabase
      .from('Users')
      .delete()
      .not('id', 'is', null);

    if (usersError) {
      console.error('Error clearing Users table:', usersError);
      return;
    }

    console.log('Successfully cleared all user data');
  } catch (error) {
    console.error('Error in clearAllUsers:', error);
  }
}

// Run the function
clearAllUsers(); 