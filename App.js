import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import InputDemo from './src/components/InputDemo';
import Counter from './src/components/Counter';
export default function App() {
  return (
    <View style={styles.container}>
      <Counter />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});