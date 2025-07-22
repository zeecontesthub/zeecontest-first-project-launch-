import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Get user from localStorage if available
  const [user, setUserState] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [userContests, setUserContests] = useState(() => {
    const storedContests = localStorage.getItem("userContests");
    return storedContests ? JSON.parse(storedContests) : [];
  });

  const [createContest, setCreateContestState] = useState(() => {
    const storedContest = localStorage.getItem("create-contest");
    return storedContest ? JSON.parse(storedContest) : null;
  });

  // Save createContest to localStorage whenever it changes
  useEffect(() => {
    if (createContest) {
      localStorage.setItem("create-contest", JSON.stringify(createContest));
    } else {
      localStorage.removeItem("create-contest");
    }
  }, [createContest]);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Save userContests to localStorage whenever it changes
  useEffect(() => {
    if (userContests && userContests.length > 0) {
      localStorage.setItem("userContests", JSON.stringify(userContests));
    } else {
      localStorage.removeItem("userContests");
    }
  }, [userContests]);

  // Wrap setUser to update both state and localStorage
  const setUser = (userData) => {
    setUserState(userData);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userContests,
        setUserContests,
        createContest,
        setCreateContest: setCreateContestState,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easy usage
export const useUser = () => useContext(UserContext);
