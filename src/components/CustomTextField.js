import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomTextField = ({ value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize }) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f6f6fa',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    width: '100%',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d1e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});

export default CustomTextField; 