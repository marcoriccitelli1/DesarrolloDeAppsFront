import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cambiar Contraseña</Text>
      <Text style={styles.subtitle}>
        Introduce tu contraseña actual y la nueva contraseña
      </Text>
      <CustomTextField
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Contraseña actual"
        secureTextEntry
      />
      <CustomTextField
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Nueva contraseña"
        secureTextEntry
      />
      <CustomTextField
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirmar nueva contraseña"
        secureTextEntry
      />
      <Text style={styles.helpText}>
        La contraseña debe tener al menos 8 caracteres.
      </Text>
      <CustomButton
        title="Cambiar contraseña"
        onPress={() => {}}
        style={styles.changeButton}
      />
      <CustomButton
        title="Cancelar"
        onPress={() => {}}
        style={styles.cancelButton}
        textStyle={styles.cancelButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6fa',
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 25,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  changeButton: {
    backgroundColor: '#6c4eb6',
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  cancelButtonText: {
    color: '#fff',
  },
});

export default ChangePasswordScreen; 