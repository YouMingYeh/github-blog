import React, { createContext, useContext, useState, useEffect } from "react";
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
  const { data: data } = useSession();
  const session = data as SessionWithToken;
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    // Assuming your session object has the token at session.token
    if (session?.token) {
      setToken(session.token);
    }
    if (session?.user) {
      setUser(session.user);
    }
  }, [session]);

  return (
    <AuthContext.Provider value={{ token, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
