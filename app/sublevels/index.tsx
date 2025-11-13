import { Redirect } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import Sublevels from "../../src/screens/Sublevels";

export default function SublevelsRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <Sublevels />;
}
