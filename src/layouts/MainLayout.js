import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('Menu');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{children}</View>
      <Navbar onTabPress={handleTabPress} activeTab={activeTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
});

export default MainLayout; 