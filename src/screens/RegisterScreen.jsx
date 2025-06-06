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
  Modal
} from 'react-native';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { useAxios } from '../hooks/useAxios';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../config/firebase';

const auth = getAuth(app);

const SocialButton = ({ icon, text, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} style={[styles.socialButton, disabled && styles.disabledButton]} disabled={disabled}>
    <Image source={icon} style={styles.socialIcon} />
    <Text style={styles.socialText}>{text}</Text>
  </TouchableOpacity>
);

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  
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

  const handleProviderRegister = async (providerType) => {
    if (!providerType) {
      setError('Proveedor no especificado');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let provider;
      if (providerType === 'google') {
        provider = new GoogleAuthProvider();
      } else {
        setError('Proveedor no soportado');
        setLoading(false);
        return;
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Verifica formato JWT
      if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(idToken)) {
        console.error("El idToken no tiene formato JWT:", idToken);
        setError("Token inválido");
        setLoading(false);
        return;
      }

      setGoogleUserData({
        idToken,
        name: user.displayName,
        email: user.email
      });
      
      setShowPhoneModal(true);

    } catch (err) {
      console.error('REGISTER PROVIDER ERROR:', err);
      setError(err.message || 'Error al registrarse con el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteGoogleRegister = async () => {
    if (!phone.trim()) {
      setError('El teléfono es obligatorio');
      return;
    }

    const phoneRegex = /^\d{8,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Por favor ingresa un número de teléfono válido (mínimo 8 dígitos)');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/registerWithProvider', {
        idToken: googleUserData.idToken,
        name: googleUserData.name,
        phone: phone.trim()
      });

      setShowPhoneModal(false);
      setGoogleUserData(null);
      setPhone('');

      Alert.alert(
        'Registro Exitoso',
        'Te hemos enviado un correo de verificación. Por favor, verifica tu correo electrónico antes de iniciar sesión.',
        [{ 
          text: 'OK',
          onPress: () => navigation.navigate('Login')
        }]
      );

    } catch (err) {
      console.error('COMPLETE REGISTER ERROR:', err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 409) {
        setError('Este correo electrónico ya está registrado');
      } else {
        setError(err.message || 'Error al completar el registro');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => handleProviderRegister('google');

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

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          <SocialButton
            icon={require('../../assets/google-logo.png')}
            text="Registrarse con Google"
            onPress={handleGoogleRegister}
            disabled={loading}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.loginLink}>¿Ya tenés cuenta? Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showPhoneModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowPhoneModal(false);
            setGoogleUserData(null);
            setPhone('');
            setError('');
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Completa tu registro</Text>
              <Text style={styles.modalSubtitle}>
                Hola {googleUserData?.name}, para completar tu registro necesitamos tu número de teléfono
              </Text>
              
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
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => {
                    setShowPhoneModal(false);
                    setGoogleUserData(null);
                    setPhone('');
                    setError('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.completeButton]}
                  onPress={handleCompleteGoogleRegister}
                  disabled={loading}
                >
                  <Text style={styles.completeButtonText}>
                    {loading ? "Registrando..." : "Completar registro"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 8,
    color: '#888',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  socialIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'contain',
  },
  socialText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
  },
  completeButton: {
    backgroundColor: '#6c4eb6',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default RegisterScreen; 