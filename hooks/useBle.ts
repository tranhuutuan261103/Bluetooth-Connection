// useBle.ts (or useBle.js)
import { PermissionsAndroid } from "react-native";
import { useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";

type PermissionCallback = (granted: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
    requestPermission: (callback: PermissionCallback) => Promise<void>;
    scanForDevices: () => Promise<void>;
    stopScanning: () => void;
    connectToDevice: (deviceId: string) => Promise<void>;
    connectedDevice: Device | null;
    allDevices: Device[];
    resetDevices: () => void;
    disconnectFromDevice: () => void;
}

const useBle = (): BluetoothLowEnergyApi => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    const requestPermission = async(callback: PermissionCallback) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app requires access to your location to scan for Bluetooth devices.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            callback(granted === PermissionsAndroid.RESULTS.GRANTED);
        } catch (error) {
            console.error(error);
            callback(false);
        }
    }

    const isDuplicateDevice = (devices: Device[], nextDevice: Device) => 
        devices.findIndex((device) => device.id === nextDevice.id) !== -1;

    const scanForDevices = async() => {
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);
                return;
            }
            if (device) {
                setDevices((prevDevices) => {
                    if (isDuplicateDevice(prevDevices, device)) {
                        return prevDevices;
                    }
                    return [...prevDevices, device];
                });
            }
        });
    }

    const stopScanning = () => {
        bleManager.stopDeviceScan();
    }

    const connectToDevice = async (deviceId: string) => {
        try {
          const deviceConnection = await bleManager.connectToDevice(deviceId);
          // login to the device
            console.log('Connected to Device', deviceConnection.id);
            await deviceConnection.discoverAllServicesAndCharacteristics();

          setConnectedDevice(deviceConnection);
          bleManager.stopDeviceScan();
          await startStreamingData(deviceConnection);
        } catch (e) {
          console.log('FAILED TO CONNECT', e);
        }
      };

      const startStreamingData = async (device: Device) => {
        if (device) {
            console.log('Device Connected');
          // send data to the device
            bleManager.writeCharacteristicWithResponseForDevice(
                device.id,
                'serviceId',
                'characteristicId',
                'data',
            );
            // read data from the device

            bleManager.monitorCharacteristicForDevice(
                device.id,
                'serviceId',
                'characteristicId',
                (error, characteristic) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log(characteristic);
                }
            );
        } else {
          console.log('No Device Connected');
        }
      };

    const resetDevices = () => {
        setDevices([]);
    }

    const disconnectFromDevice = async () => {
        if (connectedDevice) {
          await bleManager.cancelDeviceConnection(connectedDevice.id);
          setConnectedDevice(null);
          console.log('Device Disconnected');
        }
      };

    return {
        requestPermission,
        scanForDevices,
        allDevices: devices,
        stopScanning,
        connectToDevice,
        connectedDevice,
        resetDevices,
        disconnectFromDevice,
    };
};

export default useBle;