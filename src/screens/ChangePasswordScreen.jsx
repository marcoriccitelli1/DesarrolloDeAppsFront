import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomTextField from '../components/CustomTextField';
import CustomButton from '../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAxios } from '../hooks/useAxios';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const axios = useAxios();
  const insets = useSafeAreaInsets();

  const validatePasswords = () => {
    setErrorMessage('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Por favor completa todos los campos');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden');
      return false;
    }

    if (newPassword.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await axios.post('/user/changePassword', {
        currentPassword,
        newPassword
      });

      Alert.alert(
        'Éxito',
        'Contraseña actualizada correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      let message = 'Error al cambiar la contraseña';
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#6c4eb6" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Cambiar Contraseña</Text>
        <Text style={styles.subtitle}>
          Introduce tu contraseña actual y la nueva contraseña
        </Text>
        <CustomTextField
          value={currentPassword}
          onChangeText={(text) => {
            setCurrentPassword(text);
            setErrorMessage('');
          }}
          placeholder="Contraseña actual"
          secureTextEntry
        />
        <CustomTextField
          value={newPassword}
          onChangeText={(text) => {
            setNewPassword(text);
            setErrorMessage('');
          }}
          placeholder="Nueva contraseña"
          secureTextEntry
        />
        <CustomTextField
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrorMessage('');
          }}
          placeholder="Confirmar nueva contraseña"
          secureTextEntry
        />
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : (
          <Text style={styles.helpText}>
            La contraseña debe tener al menos 8 caracteres.
          </Text>
        )}
        <CustomButton
          title="Cambiar contraseña"
          onPress={handleChangePassword}
          style={styles.changeButton}
          disabled={loading}
        />
        <CustomButton
          title="Cancelar"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
          disabled={loading}
        />
      </View>
    </View>
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
  helpText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  errorText: {
    fontSize: 13,
    color: '#ff3b30',
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