import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const supabase = createClient();
  return supabase.auth;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setUserError(error as any);
      } else {
        setUser(session?.user ?? null);
      }
      setIsUserLoading(false);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isUserLoading, userError };
}
