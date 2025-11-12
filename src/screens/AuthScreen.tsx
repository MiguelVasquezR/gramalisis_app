import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { signInWithEmail, signUpWithEmail } from '../lib/auth';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextField } from '../components/TextField';

const copy = {
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para seguir analizando tus textos.',
    button: 'Entrar',
    toggle: '¿No tienes cuenta? Regístrate',
  },
  register: {
    title: 'Crea tu cuenta',
    subtitle: 'Organiza tus análisis gramaticales con un solo toque.',
    button: 'Crear cuenta',
    toggle: '¿Ya tienes cuenta? Inicia sesión',
  },
};

type Mode = keyof typeof copy;

export const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Algo salió mal. Intenta nuevamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={24}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-12 gap-10">
            <View className="gap-3">
              <Text className="text-sm font-semibold uppercase tracking-widest text-brand-500">
                Gramálisis
              </Text>
              <Text className="text-3xl font-bold text-brand-900">{copy[mode].title}</Text>
              <Text className="text-base leading-6 text-brand-700">{copy[mode].subtitle}</Text>
            </View>

            <View>
              <TextField
                label="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                value={email}
                onChangeText={setEmail}
                placeholder="tucorreo@email.com"
              />

              <TextField
                label="Contraseña"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                helperText="Mínimo 6 caracteres."
              />

              {error ? <Text className="text-sm text-red-500 mb-2">{error}</Text> : null}

              <PrimaryButton label={copy[mode].button} onPress={handleSubmit} loading={loading} />
            </View>

            <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'register' : 'login')}>
              <Text className="text-center text-base font-semibold text-brand-700">
                {copy[mode].toggle}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;
