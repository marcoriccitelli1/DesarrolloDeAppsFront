import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Profile = () => {
  const nombre = 'Juan Pérez';

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{nombre}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.option}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6fa',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6c4eb6',
    marginBottom: 40,
    alignSelf: 'flex-start',
  },
  optionsContainer: {
    marginTop: 10,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 8,
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
  },
});

export default Profile; 