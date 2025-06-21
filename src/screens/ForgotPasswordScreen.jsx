import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Pressable
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import { useAxios } from '../hooks/useAxios';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const axios = useAxios();
  const insets = useSafeAreaInsets();

  const handleSendEmail = async () => {
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post('/auth/changePassword', { email });
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Login');
      }, 2000);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View 
        style={[
          styles.mainContainer,
          { paddingTop: insets.top, paddingBottom: insets.bottom }
        ]}
      >
        <StatusBar
          backgroundColor="#f9f6fa"
          barStyle="dark-content"
        />
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#6c4eb6" />
            </Pressable>
          </View>
          <Text style={styles.title}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo electrónico para recibir instrucciones
          </Text>
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
              style={styles.sendButton}
            />
          </View>
        </View>

        <CustomModal
          visible={showSuccessModal}
          message="Se ha enviado un correo con instrucciones para recuperar tu contraseña"
          onAccept={() => {}}
          onCancel={() => {}}
          showButtons={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f9f6fa'
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f6fa',
    paddingHorizontal: 20,
  },
  header: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
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
  form: {
    width: '100%',
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#6c4eb6',
    width: '70%',
    alignSelf: 'center',
    marginTop: 10,
  },

  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen; 
