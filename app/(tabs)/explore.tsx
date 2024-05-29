import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import BleManager from 'react-native-ble-manager';

export default function TabTwoScreen() {

  const scanForDevices = async() => {
    BleManager.scan([], 3, true).then((results) => {
      console.log('Scanning...');
    });
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <TouchableOpacity
        onPress={scanForDevices}
        style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
      >
        <ThemedText>Scan device Bluetooth</ThemedText>
      </TouchableOpacity>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
