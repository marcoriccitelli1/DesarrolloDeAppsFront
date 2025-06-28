import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

const CustomButton = ({ title, onPress, style, textStyle, icon }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button, 
        style, 
        pressed && styles.pressed
      ]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon}
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#6c4eb6',
    paddingVertical: 13,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.7,
  }
});

export default CustomButton; 