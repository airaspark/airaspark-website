import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth as firebaseAuth } from "@/firebase";
import { getUserProfile } from "@/services/user.service";
import { setAuthPersistence } from "@/services/auth.service";
import { getRememberMePreference } from "@/utils/session";
import type { UserProfile, UserRole } from "@/types";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  refreshProfile: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  hasRole: (...roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const refreshProfile = useCallback(async () => {
    const fbUser = firebaseAuth.currentUser;
    if (!fbUser) {
      setUser(null);
      return;
    }
    const profile = await getUserProfile(fbUser.uid);
    setUser(profile);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const rememberMe = getRememberMePreference();
      await setAuthPersistence(rememberMe);
    }

    init();

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (!mounted) return;

      setLoading(true);
      try {
        if (fbUser) {
          const profile = await getUserProfile(fbUser.uid);
          if (mounted) {
            setUser(profile);
          }
        } else {
          if (mounted) {
            setUser(null);
          }
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      initialized,
      refreshProfile,
      setUser,
      hasRole,
    }),
    [user, loading, initialized, refreshProfile, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
