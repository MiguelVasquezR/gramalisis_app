import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmail } from '../lib/auth';

const illustrationUri =
  'https://images.ctfassets.net/3s5io6mnxfqz/3b1YgnSUZXM0TLWHe9NmQP/d2721f9dc57f6711d2fef1ea46421efb/Wealthfront-App.png';

export const AuthScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('johndoe@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Algo salió mal. Intenta nuevamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const showBack = router.canGoBack();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={24}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable
              style={[styles.backButton, !showBack && styles.backButtonDisabled]}
              disabled={!showBack}
              onPress={() => {
                if (showBack) {
                  router.back();
                }
              }}
            >
              <Text style={showBack ? styles.backLabel : styles.backLabelDisabled}>{'‹'}</Text>
            </Pressable>
          </View>

          <View style={styles.illustrationWrapper}>
            <Image source={{ uri: illustrationUri }} style={styles.illustration} resizeMode="cover" />
          </View>

          <View style={styles.content}>
            <View style={styles.heading}>
              <Text style={styles.title}>Bienvenido!</Text>
              <Text style={styles.subtitle}>Ingresa tus datos en la parte inferior!</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.fieldInput}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="johndoe@gmail.com"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  style={styles.fieldInput}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitLabel}>Iniciar Sesión</Text>
                )}
              </Pressable>

              <View style={styles.linkGroup}>
                <Pressable onPress={() => {}} style={styles.linkButton}>
                  <Text style={styles.link}>Olvidate tu contraseña?</Text>
                </Pressable>
                <Pressable onPress={() => router.push('/registry')} style={styles.linkButton}>
                  <Text style={styles.link}>No tienes cuenta? Registrate</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonDisabled: {
    backgroundColor: 'transparent',
  },
  backLabel: {
    fontSize: 30,
    color: '#5d3fd3',
    fontWeight: '500',
  },
  backLabelDisabled: {
    fontSize: 30,
    color: '#d1d5db',
    fontWeight: '500',
  },
  illustrationWrapper: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  illustration: {
    width: '100%',
    height: 256,
    borderRadius: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 64,
  },
  heading: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    marginTop: 8,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#9ca3af',
    marginBottom: 8,
  },
  fieldInput: {
    borderBottomWidth: 1,
    borderColor: '#d1d5db',
    paddingBottom: 12,
    fontSize: 18,
    color: '#0f172a',
  },
  error: {
    fontSize: 14,
    color: '#ef4444',
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5a46ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  linkGroup: {
    marginTop: 12,
  },
  linkButton: {
    marginTop: 4,
    marginBottom: 8,
  },
  link: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#5a46ff',
  },
});
