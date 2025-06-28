import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback,
  Keyboard,
  TextInput
} from 'react-native';
import CustomButton from './CustomButton';

const CustomModal = ({ 
  visible, 
  message, 
  onAccept, 
  onCancel,
  acceptText = "Aceptar",
  cancelText = "Cancelar",
  acceptButtonStyle,
  cancelButtonStyle,
  acceptTextStyle,
  cancelTextStyle,
  showButtons = true,
  showCancelButton = true,
  showInput = false,
  inputValue,
  onInputChange,
  inputPlaceholder = "Ingrese el código",
  inputKeyboardType = 'default',
  inputMaxLength,
  errorText,
  successText
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.message}>{message}</Text>
            {showInput && !successText && (
              <TextInput
                style={styles.input}
                value={inputValue}
                onChangeText={onInputChange}
                placeholder={inputPlaceholder}
                keyboardType={inputKeyboardType}
                maxLength={inputMaxLength}
                placeholderTextColor="#999"
              />
            )}
            {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
            {successText ? <Text style={styles.successText}>{successText}</Text> : null}
            {showButtons && !successText && (
              <View style={styles.buttonContainer}>
                {showCancelButton && (
                  <CustomButton
                    title={cancelText}
                    onPress={onCancel}
                    style={[styles.cancelButton, cancelButtonStyle]}
                    textStyle={[styles.cancelButtonText, cancelTextStyle]}
                  />
                )}
                <CustomButton
                  title={acceptText}
                  onPress={onAccept}
                  style={[
                    styles.acceptButton, 
                    acceptButtonStyle,
                    !showCancelButton && styles.fullWidthButton
                  ]}
                  textStyle={acceptTextStyle}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  successText: {
    color: '#34A853',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#6c4eb6',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
  },
  cancelButtonText: {
    color: '#fff',
  },
  fullWidthButton: {
    flex: 1,
  },
});

export default CustomModal;