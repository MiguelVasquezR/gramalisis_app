import { Redirect } from 'expo-router';
import HomeScreen from '../../src/screens/HomeScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function HomeRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/registry" />;
  }

  return <HomeScreen />;
}

