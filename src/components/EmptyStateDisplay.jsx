import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyStateDisplay = ({ icon = '📦', mainMessage, subMessage, containerStyle }) => {
  return (
    <View style={[styles.fullScreenCenter, containerStyle]}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>{icon}</Text>
        <Text style={styles.text}>{mainMessage}</Text>
        {subMessage ? <Text style={styles.subText}>{subMessage}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f6fa',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    color: '#6c4eb6',
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyStateDisplay; 