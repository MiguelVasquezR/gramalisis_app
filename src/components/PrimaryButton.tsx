import { ActivityIndicator, Pressable, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export const PrimaryButton = ({ label, onPress, loading, variant = 'primary', disabled }: Props) => {
  const baseStyles =
    variant === 'primary'
      ? 'bg-brand-600 active:bg-brand-700'
      : 'bg-white border border-brand-200 active:bg-brand-50';
  const textColor = variant === 'primary' ? 'text-white' : 'text-brand-700';

  return (
    <Pressable
      className={`w-full flex-row items-center justify-center rounded-2xl px-4 py-3 ${baseStyles} ${
        disabled || loading ? 'opacity-60' : ''
      }`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1d2b74'} />
      ) : (
        <Text className={`text-base font-semibold ${textColor}`}>{label}</Text>
      )}
    </Pressable>
  );
};

