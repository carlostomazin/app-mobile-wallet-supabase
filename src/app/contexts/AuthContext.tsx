import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState, useEffect } from "react";

interface UserData {
  id: string;
  name: string;
  created_at: string;
}

interface AuthContextProps {
  user: User | null;
  userData: UserData | null;
  setAuth: (authUser: User | null, userData: UserData | null) => void;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  function setAuth(authUser: User | null, UserData: UserData | null = null) {
    setUser(authUser);
    setUserData(UserData);
  }

  return (
    <AuthContext.Provider value={{ user, userData, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;