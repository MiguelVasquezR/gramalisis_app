import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function IndexRoute() {
  const { user } = useAuth();
  return <Redirect href={user ? '/home' : '/registry'} />;
}

