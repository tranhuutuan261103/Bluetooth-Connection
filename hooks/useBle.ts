// useBle.ts (or useBle.js)
import { PermissionsAndroid } from "react-native";
import { useState } from "react";
import { BleManager, Device, Service, Characteristic, BleError } from "react-native-ble-plx";
import { Buffer } from "buffer";

type PermissionCallback = (granted: boolean) => void;

const bleManager = new BleManager();

const service = '0000FFE0-0000-1000-8000-00805F9B34FB';
const characteristic = '0000FFE1-0000-1000-8000-00805F9B34FB';

interface BluetoothLowEnergyApi {
    allDevices: Device[];
    connectedDevice: Device | null;
    streamData: string;

    requestPermission: (callback: PermissionCallback) => Promise<void>;
    scanForDevices: () => Promise<void>;
    stopScanning: () => void;

    connectToDevice: (deviceId: string) => Promise<void>;
    disconnectFromDevice: () => void;

    sendDataStream: (data: string) => Promise<void>;
    startStreamingData: () => Promise<void>;
}

const useBle = (): BluetoothLowEnergyApi => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
    const [streamData, setStreamData] = useState<string>("");

    const requestPermission = async (callback: PermissionCallback) => {
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

    const scanForDevices = async () => {
        setDevices([]);
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);
                return;
            }
            if (device && device.name) {
                if (device.name === 'BT05') {
                    stopScanning();
                }
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
            deviceConnection.discoverAllServicesAndCharacteristics()
                .then(() => {
                    bleManager.servicesForDevice(deviceId)
                        .then((services) => {
                            // console.log(services);
                        });
                    bleManager.characteristicsForDevice(deviceId, service)
                        .then((characteristics) => {
                            // console.log(characteristics);
                        });
                }).then(() => {
                    startStreamingDataStatic(deviceConnection);
                })
                .catch((error) => {
                    console.error(error);
                });
            setConnectedDevice(deviceConnection);
        } catch (e) {
            console.error(e);
        }
    };

    const startStreamingDataStatic = async (device: Device) => {
        if (device) {
            console.log('Starting Stream');
            device.monitorCharacteristicForService(
                service,
                characteristic,
                (error, characteristic) => {
                    onStreamDataChange(error, characteristic);
                }
            );
        } else {
            console.log('No Device Connected');
        }
    };

    const startStreamingData = async () => {
        if (connectedDevice) {
            console.log('Starting Stream');
            connectedDevice.monitorCharacteristicForService(
                service,
                characteristic,
                (error, characteristic) => {
                    onStreamDataChange(error, characteristic);
                }
            );
        } else {
            console.log('No Device Connected');
        }
    };

    const onStreamDataChange = (
        error: BleError | null,
        characteristic: Characteristic | null,
    ) => {
        if (error) {
            console.log(error);
            setConnectedDevice(null);
            return -1;
        } else if (!characteristic?.value) {
            console.log('No Data was recieved');
            return -1;
        }

        const rawData = atob(characteristic.value);
        console.log('Data Recieved', rawData);

        setStreamData(rawData);
    };

    const sendDataStream = async (data: string) => {
        if (connectedDevice) {
            const buffer = Buffer.from(data);
            connectedDevice.writeCharacteristicWithResponseForService(
                service,
                characteristic,
                buffer.toString('base64'),
            ).then((result) => {
                console.log('Data Sent', result);
            }
            ).catch((error: BleError) => {
                if (error.errorCode === 401) {
                    console.log('Data Send: ', data);
                } else {
                    console.error(error);
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }

    const disconnectFromDevice = async () => {
        if (connectedDevice) {
            const deviceId = connectedDevice.id;
            await bleManager.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
            console.log(`Device ${deviceId} Disconnected`);
        }
    };

    return {
        allDevices: devices,
        connectedDevice,
        streamData,
        requestPermission,
        scanForDevices,
        stopScanning,
        connectToDevice,
        disconnectFromDevice,
        sendDataStream,
        startStreamingData,
    };
};

export default useBle;