import { Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import ProfileEditScreen from '../../src/screens/ProfileEditScreen';

export default function ProfileEditRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.emailVerified) {
    return <Redirect href="/verify-email" />;
  }

  return <ProfileEditScreen />;
}
