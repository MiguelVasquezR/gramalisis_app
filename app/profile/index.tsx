import { Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import ProfileScreen from '../../src/screens/ProfileScreen';

export default function ProfileRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.emailVerified) {
    return <Redirect href="/verify-email" />;
  }

  return <ProfileScreen />;
}
