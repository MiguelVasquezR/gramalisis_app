import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export const PrimaryButton = ({ label, onPress, loading, variant = 'primary', disabled }: Props) => {
  const buttonStyles = [
    styles.button,
    variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
    (disabled || loading) && styles.buttonDisabled,
  ];

  const textStyles = [
    styles.label,
    variant === 'primary' ? styles.labelPrimary : styles.labelSecondary,
  ];

  return (
    <Pressable style={buttonStyles} onPress={onPress} disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1d2b74'} />
      ) : (
        <Text style={textStyles}>{label}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: '#364fe6',
  },
  buttonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#c7d6ff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  labelPrimary: {
    color: '#ffffff',
  },
  labelSecondary: {
    color: '#1d2b74',
  },
});
