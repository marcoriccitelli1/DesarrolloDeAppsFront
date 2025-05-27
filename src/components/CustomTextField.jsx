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
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 14,
    marginBottom: 12,
    width: '100%',
    fontSize: 16,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'transparent',
    borderBottomColor: '#bdbdbd',
    shadowColor: 'transparent',
  },
});

export default CustomTextField; 