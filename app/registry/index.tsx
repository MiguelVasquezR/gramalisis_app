import { Redirect } from 'expo-router';
import AuthScreen from '../../src/screens/AuthScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function RegistryRoute() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/home" />;
  }

  return <AuthScreen />;
}

