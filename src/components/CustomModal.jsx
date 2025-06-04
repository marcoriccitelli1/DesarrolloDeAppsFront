import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback,
  Keyboard
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
  showButtons = true
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
            {showButtons && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  title={cancelText}
                  onPress={onCancel}
                  style={[styles.cancelButton, cancelButtonStyle]}
                  textStyle={[styles.cancelButtonText, cancelTextStyle]}
                />
                <CustomButton
                  title={acceptText}
                  onPress={onAccept}
                  style={[styles.acceptButton, acceptButtonStyle]}
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
    marginBottom: showButtons => showButtons ? 24 : 0,
    lineHeight: 24,
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
});

export default CustomModal;