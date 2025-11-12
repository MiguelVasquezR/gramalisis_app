import { SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const avatarUri =
  'https://images.ctfassets.net/3s5io6mnxfqz/2X8tOCmFLK9X4nHIaWkKQ4/7654afad8eb5b3a0b2733bc8f42b77d8/mobbin-profile.png';

const CardRow = ({ icon, label }: { icon: string; label: string }) => (
  <View style={styles.cardRow}>
    <Text style={styles.cardRowIcon}>{icon}</Text>
    <Text style={styles.cardRowText}>{label}</Text>
  </View>
);

export const ProfileScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const name = user?.displayName ?? 'John Doe';
  const email = user?.email ?? 'john.doe@example.com';
  const joined = 'Joined August 17, 2023';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.menuRow}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuButtonLabel}>⋮</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} resizeMode="cover" />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.joined}>{joined}</Text>
        </View>

        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>General</Text>
            <CardRow icon="👤" label={name} />
            <View style={styles.divider} />
            <CardRow icon="✉️" label={email} />
            <View style={styles.divider} />
            <CardRow icon="📱" label="(628) 267-9041" />
            <View style={styles.divider} />
            <CardRow icon="💬" label="Feedback" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notifications</Text>
            <CardRow icon="🔔" label="Push notifications" />
            <View style={styles.divider} />
            <CardRow icon="📅" label="Daily summary" />
            <View style={styles.divider} />
            <CardRow icon="📣" label="Product updates" />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeLabel}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  menuButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#f4f4f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonLabel: {
    fontSize: 24,
    color: '#0f172a',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  name: {
    marginTop: 24,
    fontSize: 30,
    fontWeight: '700',
    color: '#0f172a',
  },
  joined: {
    marginTop: 4,
    fontSize: 16,
    color: '#6b7280',
  },
  cards: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e4e4e7',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardRowIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  cardRowText: {
    fontSize: 16,
    color: '#0f172a',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  closeButton: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#e4e4e7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
});
