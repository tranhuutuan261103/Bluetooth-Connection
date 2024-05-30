import React, { useEffect, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, NativeModules, NativeEventEmitter, Alert, View, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import BleManager, { Peripheral } from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function TabTwoScreen() {
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Peripheral | null>(null);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [text, setText] = useState('');
  
  const handleGetConnectedDevices = () => {
    BleManager.getBondedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        console.log('Bonded Peripheral:', results[i]);
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };
  useEffect(() => {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      handleGetConnectedDevices();
    });
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        peripherals.set(peripheral.id, peripheral);
        setDiscoveredDevices(Array.from(peripherals.values()));
      },
    );
    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );
    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    }
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  }, []);
  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };
  // pair with device first before connecting to it
  const connectToPeripheral = peripheral => {
    BleManager.createBond("4C:24:98:2C:1C:1F")
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        setConnectedDevice(peripheral);
        console.log('BLE device paired successfully');
      })
      .catch(() => {
        console.log('failed to bond');
      });
  };
  // disconnect from device
  const disconnectFromPeripheral = peripheral => {
    BleManager.removeBond(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        Alert.alert(`Disconnected from ${peripheral.name}`);
      })
      .catch(() => {
        console.log('fail to remove the bond');
      });
  };

  const handleDiscoverPeripheral = peripheral => {
    BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
      console.log('peripheralInfo', peripheralInfo.services);
      var f_uuid = 0;
      for (var i = peripheralInfo.services.length - 1; i >= 0; i--) {
        if(peripheralInfo.services[i].uuid.toUpperCase() === this.state.uuid.toUpperCase())
        {
          f_uuid = 1;
          break;
        }
      }

      console.log('f_uuid', f_uuid);

      if(f_uuid)
      {
        // OK for UUID
        console.log('Ok for UUID', peripheral.id);
      }else{
        console.log('NG for UUID', peripheral.id);
          //Disconnect 
          BleManager.disconnect(peripheral.id)
          .then(() => {
            // Success code
            console.log('Disconnected', peripheral.id);
            return;
          })
          .catch((error) => {
            // Failure code
            console.log(error);
          }); 
      }
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
        onPress={startScan}
        style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
      >
        <ThemedText>Scan device Bluetooth</ThemedText>
      </TouchableOpacity>
      <Link href="/boatcontroller"
        style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
        >
        <ThemedText>Boat controller</ThemedText>
        </Link>
        {
          connectedDevices.map((device: Peripheral) => (
            <View
              key={device.id}
              style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
            >
              <ThemedText>{device.name}</ThemedText>
              <ThemedText>{device.advertising.serviceUUIDs}</ThemedText>
              <TouchableOpacity
                onPress={() => connectToPeripheral(device)}
                style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
              >
                <ThemedText>Connect</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => disconnectFromPeripheral(device)}
                style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
              >
                <ThemedText>Disconnect</ThemedText>
              </TouchableOpacity>
            </View>
          ))
        }
        {
          connectedDevice && (
            <Collapsible title="Connected device">
              <ThemedText>{connectedDevice.name}</ThemedText>
              <ThemedText>{connectedDevice.id}</ThemedText>
              <TextInput placeholder="Write something..." value={text} 
                onChangeText={setText}
                style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
              />
              <TouchableOpacity
                onPress={() => {
                  handleDiscoverPeripheral(connectedDevice);
                }}
                style={{ padding: 16, backgroundColor: '#E0E0E0', borderRadius: 8, margin: 16 }}
              >
                <ThemedText>Send</ThemedText>
              </TouchableOpacity>

            </Collapsible>
          )
        }
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
