import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
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
  // Use the session object from next-auth
  const { data: data } = useSession();
  const session = data as SessionWithToken;

  // Define the state variable
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    if (session?.token) {
      setToken(session.token);
    }
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  // Memoize the context value to avoid unnecessary re-renders
  const authValue = useMemo(() => ({ token, user }), [token, user]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
