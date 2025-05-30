import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { useAxios } from '../hooks/useAxios';


const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const axios = useAxios();

  const validateForm = () => {
    if (!fullName || !email || !password || !repeatPassword || !phone) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('El correo electrónico no es válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      setError('');
      setLoading(true);

      if (!validateForm()) {
        setLoading(false);
        return;
      }

      await axios.post('/auth/register', {
        email,
        password,
        name: fullName,
        phone,
      });

      Alert.alert(
        'Registro Exitoso',
        'Te hemos enviado un correo de verificación. Por favor, verifica tu correo electrónico antes de iniciar sesión.',
        [{ 
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }]
      );

    } catch (err) {
      console.error('Error en registro:', err);
      setError(
        err.response?.data?.error || 
        'Ocurrió un error durante el registro. Por favor, intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
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
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <CustomButton 
            title={loading ? "Registrando..." : "Registrarse"} 
            onPress={handleRegister}
            disabled={loading}
          />
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginLink}>¿Ya tenés cuenta? Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default RegisterScreen; 