import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useSession } from "next-auth/react";

interface AuthContextType {
  token: string;
  user: User;
}

const defaultContextValue: AuthContextType = {
  token: "",
  user: {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }) => {
  const data = useSession();
  const session = data as SessionWithToken;
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});

  const value = useMemo(() => ({ token, user }), [token, user]);

  useEffect(() => {
    // Assuming your session object has the token at session.token
    if (session?.token) {
      setToken(session.token);
    }
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
