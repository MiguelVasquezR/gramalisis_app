import { Redirect } from 'expo-router';
import AuthScreen from '../../src/screens/AuthScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginRoute() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href={user.emailVerified ? '/home' : '/verify-email'} />;
  }

  return <AuthScreen />;
}
