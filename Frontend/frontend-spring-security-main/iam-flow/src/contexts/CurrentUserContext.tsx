import { useEffect, useState} from "react";
import { CurrentUserContext } from "./CurrentUserContextTypes";
import { authService } from "../services";
import type { UserResponse } from "../models/response/UserResponse";
import { CurrentUserLoader } from "../components/loading/CurrentUserLoader";


export const CurrentUserContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (e) {
        console.log(e)
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Show loader until user is fetched
  if (loading) return <CurrentUserLoader />;

  return (
    <CurrentUserContext.Provider value={currentUser}>
      {children}
    </CurrentUserContext.Provider>
  );
};
