import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ScrollView, Button, TouchableOpacity, PermissionsAndroid, TextInput } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import useBle from '@/hooks/useBle';

export default function HomeScreen() {
  const {
    allDevices,
    connectedDevice,
    streamData,

    requestPermission,
    scanForDevices,
    stopScanning,

    connectToDevice,
    disconnectFromDevice,

    startStreamingData,
    sendDataStream
  } = useBle();

  const [data, setData] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleStopScanning = () => {
    setIsScanning(false);
    stopScanning();
  };

  const handleScanForDevices = async () => {
    setIsScanning(true);
    await scanForDevices();
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        {
          isScanning
            ? <Button title="Stop scanning" onPress={handleStopScanning} />
            : <Button title="Scan for devices" onPress={handleScanForDevices} />
        }
      </ThemedView>
      <ScrollView>
        {allDevices.map((device) => (
          <TouchableOpacity
            key={device.id}
            onPress={() => connectToDevice(device.id)}
          >
            <ThemedText key={device.id}>{`${device.id} ${device.localName}`}</ThemedText>
          </TouchableOpacity>
        ))}
        {
        connectedDevice && (
          <ThemedView>
            <ThemedText>{`Connected to ${connectedDevice.id}`}</ThemedText>
            <TextInput onChangeText={setData} value={data} 
              style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
            />
            <Button
              title="Send data"
              onPress={() => sendDataStream(`${data}\n`)}
            />
            <Button
              title="Disconnect from device"
              onPress={disconnectFromDevice}
            />
          </ThemedView>
        )
      }
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
