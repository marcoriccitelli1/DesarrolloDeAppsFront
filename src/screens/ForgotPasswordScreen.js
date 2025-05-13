import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <View style={styles.form}>
        <CustomTextField
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomButton
          title="Enviar Correo"
          onPress={() => {}}
          style={{ width: '70%', alignSelf: 'center' }}
        />
        <TouchableOpacity onPress={() => navigation?.navigate('LoginScreen')}>
          <Text style={styles.loginLink}>¿Ya tienes cuenta? Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  loginLink: {
    color: '#3b5fff',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen; 