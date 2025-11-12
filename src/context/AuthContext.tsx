import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User as UserFB, onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAppDispatch } from "../store/AppStore";
import { getDataByEmail } from "../firebase/dbService";

type AuthContextValue = {
  user: UserFB | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserFB | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);

      if (!nextUser?.email) {
        dispatch({ type: "SET_USER", payload: null });
        setLoading(false);
        return;
      }

      const dataUser = await getDataByEmail("USERS", nextUser.email);
      const currentUser = (dataUser as User) || null;
      dispatch({ type: "SET_USER", payload: currentUser });
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch]);

  const value = useMemo(
    () => ({
      user,
      loading,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
