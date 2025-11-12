import { Redirect } from 'expo-router';
import GameScreen from '../../src/screens/GameScreen';
import { useAuth } from '../../src/context/AuthContext';

export default function GameRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <GameScreen />;
}
