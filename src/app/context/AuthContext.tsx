'use client'

import { createContext,useContext,useEffect, useState, ReactNode } from "react"
import { AuthContextData } from "../../../interfaces/userDetails"
import { useRouter } from 'next/navigation';
import baseapi from "../../../lib/axios";
import { setTokens, removeTokens, getAccessToken } from "../../../lib/auth";

const AuthContext = createContext<AuthContextData |undefined >(undefined);

export const AuthProvider = ({children}: {children:ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
        const token = getAccessToken();
        if (token) {
            setIsAuthenticated(true);
        } else {
           setIsAuthenticated(false);
        }
        setIsLoading(false);
    }
    checkAuth();
}, [])


const login = async (username: string, password: string) =>{
    try {
        setIsLoading(true);
        const response = await baseapi.post('/api/token/', {username, password});
        const {access} = response.data;

        setTokens({accessToken: access});
        setIsAuthenticated(true);
        router.push('/')
    } catch (error: unknown) {
  let message = 'Login failed. Please provide correct username and password';

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'object' && error !== null && 'response' in error) {
   
    message = error.response?.data?.detail || message;
  }

  console.log('Error login:', message);
  setIsAuthenticated(false);
  throw new Error(message);
} finally {
  setIsLoading(false);
}

};

const register = async(username:string, password: string, email: string) =>{
try {
  setIsLoading(true);
  const response = await baseapi.post('/api/users/register/', { username, password, email });
  console.log("Registration successful", response.data);
  router.push('/login');
} catch (error: unknown) {
  let errorMessage = 'Registration process is terminated';

  if (error instanceof Error) {
    errorMessage = error.message;
  }

  // Handle Axios error shape
  if (typeof error === 'object' && error !== null && 'response' in error) {
    
    const data = error.response?.data;
    if (data?.username) errorMessage += ` Username: ${data.username.join(', ')}`;
    if (data?.password) errorMessage += ` Password: ${data.password.join(', ')}`;
    if (data?.email) errorMessage += ` Email: ${data.email.join(', ')}`;
  }

  console.log("Registration failed!!!", errorMessage);
  throw new Error(errorMessage);
} finally {
  setIsLoading(false);
}

};

  const logout = () => {
    removeTokens();
    setIsAuthenticated(false);
    router.push('/login'); 
  };

  return(
    <AuthContext.Provider value={{isAuthenticated, login, register, logout,isLoading }}>
        {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
