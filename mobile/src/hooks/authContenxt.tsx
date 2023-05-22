import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from "react";
  import * as SecureStore from 'expo-secure-store'
  interface AuthProviderProps {
    children: ReactNode;
  }
  
  interface AuthContextProps {
    token: string | null
  }
  const UserContext = createContext({} as AuthContextProps);
  
  export default function AuthProvider({ children }: AuthProviderProps) {

    const token = 'oi'
    // const [token , setToken] = useState<string | null>('')

    // async function loadToken() {
    //   const t = await SecureStore.getItemAsync('token')
    //   setToken(t)
    // }

    // useEffect(() => {
    //     loadToken()
    // }, [token])

    return (
      <UserContext.Provider
        value={{
          token
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
  
  export function useAuth() {
    return useContext(UserContext);
  }