import React, { useState, useEffect } from 'react';
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
  Platform,
  Pressable
} from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { useAxios } from '../hooks/useAxios';
import { Ionicons } from '@expo/vector-icons';


const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const axios = useAxios();

  // Validar email en tiempo real
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Correo electrónico no válido');
      } else {
        setEmailError('');
      }
    } else {
      setEmailError('');
    }
  }, [email]);

  const validateForm = () => {
    // Validar campos vacíos
    if (!fullName || !email || !password || !repeatPassword || !phone) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    // Validar nombre (no vacío)
    if (fullName.trim().length === 0) {
      setError('Por favor ingresa tu nombre');
      return false;
    }

    // Validar email
    if (emailError) {
      setError(emailError);
      return false;
    }

    // Validar contraseña
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validar que las contraseñas coincidan
    if (password !== repeatPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    // Validar teléfono (al menos 8 dígitos)
    const phoneRegex = /^\d{8,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)');
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
        name: fullName.trim(),
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
      if (err.response?.status === 409) {
        setError('Este correo electrónico ya está registrado');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Ocurrió un error durante el registro. Por favor, intenta nuevamente.');
      }
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
            onChangeText={(text) => {
              setFullName(text);
              setError('');
            }}
            placeholder="Nombre"
            autoCapitalize="words"
            editable={!loading}
          />
          <View style={styles.emailContainer}>
            <View style={styles.emailInputWrapper}>
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
              {email && (
                <Ionicons 
                  name={emailError ? "close-circle" : "checkmark-circle"} 
                  size={20} 
                  color={emailError ? "#ff3b30" : "#34C759"} 
                  style={styles.emailIcon}
                />
              )}
            </View>
            {emailError ? <Text style={styles.emailErrorText}>{emailError}</Text> : null}
          </View>
          <CustomTextField
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            placeholder="Contraseña"
            secureTextEntry
            editable={!loading}
          />
          <CustomTextField
            value={repeatPassword}
            onChangeText={(text) => {
              setRepeatPassword(text);
              setError('');
            }}
            placeholder="Repetir contraseña"
            secureTextEntry
            editable={!loading}
          />
          <CustomTextField
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setError('');
            }}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            editable={!loading}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <CustomButton 
            title={loading ? "Registrando..." : "Registrarse"} 
            onPress={handleRegister}
            disabled={loading || !!emailError}
          />
          <Pressable 
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginLink}>¿Ya tenés cuenta? Iniciar sesión</Text>
          </Pressable>
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
  emailContainer: {
    width: '100%',
    marginBottom: 10,
  },
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  emailIcon: {
    position: 'absolute',
    right: 10,
  },
  loginLink: {
    color: '#6c4eb6',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  emailErrorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    textAlign: 'left',
  },
});

export default RegisterScreen; 