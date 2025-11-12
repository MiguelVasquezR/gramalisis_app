import { Redirect } from 'expo-router';
import RegisterScreen from '../../src/screens/RegisterScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function RegistryRoute() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href={user.emailVerified ? '/home' : '/verify-email'} />;
  }

  return <RegisterScreen />;
}
