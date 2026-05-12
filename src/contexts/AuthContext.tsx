import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const toAuthError = (error: unknown) => {
    if (error instanceof Error && /fetch/i.test(error.message)) {
      return new Error('Could not reach Supabase. Check your internet connection, Supabase URL/key, and browser network console.');
    }
    if (error instanceof Error) return error;
    return new Error('Something went wrong while contacting Supabase.');
  };

  const fetchProfile = async (authUser: User) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (data) {
      setProfile(data);
      return;
    }

    const fallbackUsername =
      typeof authUser.user_metadata.username === 'string' && authUser.user_metadata.username.trim()
        ? authUser.user_metadata.username.trim()
        : authUser.email?.split('@')[0] ?? 'Coder';

    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        username: fallbackUsername,
        xp: 0,
        streak: 0,
      }, { onConflict: 'id' })
      .select('*')
      .single();

    if (createError) throw new Error(createError.message);
    setProfile(createdProfile);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user).catch(console.error).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(error => {
      console.error(error);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user).catch(console.error);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) return { error: toAuthError(error) };

    if (!data.session) {
      return { error: new Error('Account created. Check your email to confirm it, then sign in.') };
    }

    if (data.user) {
      try {
        await fetchProfile(data.user);
      } catch (profileError) {
        return { error: toAuthError(profileError) };
      }
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? toAuthError(error) : null };
    } catch (error) {
      return { error: toAuthError(error) };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
