// useBle.ts (or useBle.js)
import { PermissionsAndroid } from "react-native";
import { useState } from "react";
import { BleManager, Device } from "react-native-ble-plx";

type PermissionCallback = (granted: boolean) => void;

const bleManager = new BleManager();

interface BluetoothLowEnergyApi {
    requestPermission: (callback: PermissionCallback) => Promise<void>;
    scanForDevices: () => Promise<void>;
    allDevices: Device[];
}

const useBle = (): BluetoothLowEnergyApi => {
    const [devices, setDevices] = useState<Device[]>([]);

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

    return {
        requestPermission,
        scanForDevices,
        allDevices: devices,
    };
};

export default useBle;