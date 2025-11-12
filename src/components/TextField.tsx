import { Text, TextInput, TextInputProps, View } from 'react-native';

type Props = TextInputProps & {
  label: string;
  helperText?: string;
};

export const TextField = ({ label, helperText, ...props }: Props) => (
  <View className="w-full mb-4">
    <Text className="text-sm font-semibold text-brand-900 mb-1">{label}</Text>
    <TextInput
      className="w-full rounded-2xl border border-brand-100 bg-white px-4 py-3 text-base text-brand-900"
      placeholderTextColor="#6b7280"
      {...props}
    />
    {helperText ? <Text className="text-xs text-brand-700 mt-1">{helperText}</Text> : null}
  </View>
);

