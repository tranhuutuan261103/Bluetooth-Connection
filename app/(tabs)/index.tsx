import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, ScrollView, Button, TouchableOpacity, PermissionsAndroid } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import useBle from '@/hooks/useBle';

export default function HomeScreen() {
  const {
    requestPermission,
    scanForDevices,
    connectToDevice,
    resetDevices,
    stopScanning,
    allDevices,
    disconnectFromDevice,
  } = useBle();

  useEffect(() => {
    
  }, []);

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
        <Button
          title="Get list of Bluetooth devices"
          onPress={scanForDevices}
        />
        <Button
          title="Reset devices list"
          onPress={resetDevices}
        />
        <Button
          title="Stop scanning for devices"
          onPress={stopScanning}
        />
        <Button
          title="Connect to device"
          onPress={() => connectToDevice("00:22:12:01:60:77")}
        />
        <Button
          title="Disconnect from device"
          onPress={disconnectFromDevice}
        />
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
