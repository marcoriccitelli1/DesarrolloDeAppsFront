import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { useAxios } from '../hooks/useAxios';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const axios = useAxios();

  const handleSendEmail = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post('/auth/changePassword', { email });
      Alert.alert(
        'Correo Enviado',
        'Se ha enviado un correo con instrucciones para recuperar tu contraseña',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (err) {
      console.error('Error al solicitar recuperación de contraseña:', err);
      setError(
        err.response?.data?.error || 
        'Error al enviar el correo de recuperación. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <View style={styles.form}>
        <CustomTextField
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <CustomButton
          title={loading ? "Enviando..." : "Enviar Correo"}
          onPress={handleSendEmail}
          disabled={loading}
          style={{ width: '70%', alignSelf: 'center' }}
        />
        <TouchableOpacity 
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
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
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen; 
