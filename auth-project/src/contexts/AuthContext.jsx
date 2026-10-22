import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
} from "../services/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check username
  const checkUsername = async (username) => {
    const users = await getUserByUsername(username);

    return users.length > 0;
  };

  // Login
  const login = async ({ email, password }) => {
    const users = await getUserByEmail(email);

    const foundUser = users.find(
      (item) => item.password === password
    );

    if (!foundUser) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("userId", foundUser.id);

    setUser(foundUser);

    return foundUser;
  };

  // Register
  const register = async (userData) => {
    const exists = await checkUsername(userData.username);

    if (exists) {
      throw new Error("Username already exists");
    }

    const existingEmail = await getUserByEmail(userData.email);

    if (existingEmail.length > 0) {
      throw new Error("Email already exists");
    }

    const newUser = await createUser({
      ...userData,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(
        userData.username
      )}`,
      createdAt: new Date().toISOString(),
    });

    return newUser;
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    const id = localStorage.getItem("userId");

    if (!id) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getUserById(id);
      setUser(currentUser);
    } catch {
      localStorage.removeItem("userId");
      setUser(null);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("userId");
    setUser(null);
  };

  // Check authentication
  const isAuthenticated = () => {
    return Boolean(user);
  };

  // Restore session on refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        await fetchCurrentUser();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated,
        fetchCurrentUser,
        checkUsername,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);