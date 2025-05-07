import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logonuevo.png')} style={styles.logo} />
      <Text style={styles.title}>Registro de Usuario</Text>
      <View style={styles.form}>
        <CustomTextField
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nombre Completo"
          autoCapitalize="words"
        />
        <CustomTextField
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextField
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
        />
        <CustomTextField
          value={repeatPassword}
          onChangeText={setRepeatPassword}
          placeholder="Repetir contraseña"
          secureTextEntry
        />
        <CustomTextField
          value={phone}
          onChangeText={setPhone}
          placeholder="Teléfono"
          keyboardType="phone-pad"
        />
        <CustomButton title="Registrarse" onPress={() => {}}  />
        <TouchableOpacity onPress={() => navigation?.navigate('LoginScreen')}>
          <Text style={styles.loginLink}>¿Ya tenés cuenta? Iniciar sesión</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  loginLink: {
    color: '#6c4eb6',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default RegisterScreen; 