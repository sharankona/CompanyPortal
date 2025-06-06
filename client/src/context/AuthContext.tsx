import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type User = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  title: string;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  fullName: string;
  email: string;
  password: string;
  department: string;
  title: string;
  role?: number; // Make role optional as it will be set to 1 (employee) by default in the backend
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/login", credentials);
      const userData = await response.json();
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.fullName}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password.",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await apiRequest("POST", "/api/register", data);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. You can now log in.",
      });
      
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed. Please try again.";
      
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorMessage,
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
