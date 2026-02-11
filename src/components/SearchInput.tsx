import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
} from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

interface SearchInputProps extends Pick<TextInputProps, 'placeholder'> {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder = 'Buscar...',
}: SearchInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Buscar productos"
        accessibilityHint="Escribe para buscar productos por título"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: spacing.md, backgroundColor: colors.background },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
