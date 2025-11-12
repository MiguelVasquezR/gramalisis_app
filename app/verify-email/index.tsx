import { Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import VerifyEmailScreen from '../../src/screens/VerifyEmailScreen';

export default function VerifyEmailRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (user.emailVerified) {
    return <Redirect href="/home" />;
  }

  return <VerifyEmailScreen />;
}
