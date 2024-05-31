import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, ScrollView, Image, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Animated from 'react-native-reanimated';

import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonControl from '@/components/ButtonControl';
import PowerPanel from '@/components/PowerPanel';
import ParallaxScrollView from '@/components/ParallaxScrollViewBoat';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import useBle from '@/hooks/useBle';

export default function BoatControllerScreen() {
    const {
        allDevices,
        connectedDevice,
        streamData,
    
        requestPermission,
        scanForDevices,
        stopScanning,
    
        connectToDevice,
        disconnectFromDevice,
    
        sendDataStream,
        startStreamingData,
    } = useBle();

    const maxPower = 180;
    const [powerLeft, setPowerLeft] = useState(0);
    const [powerRight, setPowerRight] = useState(0);

    const changePower = (request: {direction: string}) => {
        if (request.direction === 'left') {
            sendDataStream(`a`);
        } else if (request.direction === 'right') {
            sendDataStream(`d`);
        } else if (request.direction === 'up') {
            sendDataStream(`w`);
        } else if (request.direction === 'down') {
            sendDataStream(`s`);
        }
    }

    useEffect(() => {
        connectToDevice("4C:24:98:2C:1C:1F");
    }, []);

    return (
        <ParallaxScrollView
            headerBackgroundImage={<Animated.Image source={require('../../assets/images/sea.gif')} style={styles.headerBackgroundImage} />}
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={<Animated.Image source={require('../../assets/images/boat.png')} style={styles.headerImage} />}>
            <ThemedView>
                <View
                    style={styles.topContainer}
                >
                    <View
                        style={styles.powerPanelLeft}
                    >
                        <PowerPanel currentPower={powerLeft} maxPower={maxPower} onPowerChange={() => console.log("123")} />
                        <ThemedText style={{ textAlign: 'center' }}>{streamData}</ThemedText>
                    </View>
                    <View
                        style={styles.centerContainer}
                    >
                        <Animated.Image source={require('../../assets/images/character.png')} style={styles.imageCharacter} />
                    </View>
                    <View
                        style={styles.powerPanelRight}
                    >
                        <PowerPanel currentPower={powerRight} maxPower={maxPower} onPowerChange={() => console.log("123")} />
                        <ThemedText style={{ textAlign: 'center' }}>{streamData}</ThemedText>
                    </View>
                </View>
            </ThemedView>
            <ThemedView
                style={styles.buttonControllerOuter}
            >
                <ThemedView
                    style={styles.buttonControllers}
                >
                    <View
                        style={styles.buttonControllerUp}
                    >
                        <ButtonControl
                            onPress={() => changePower({ direction: 'up' })}
                        >
                            <Ionicons name="arrow-back" size={100} color="black" style={[styles.buttonControllerIcon, {
                                transform: [{ rotate: '90deg' }]
                            }]} />
                        </ButtonControl>
                    </View>

                    <View
                        style={styles.buttonControllerLeft}
                    >
                        <ButtonControl
                            onPress={() => changePower({ direction: 'left' })}
                        >
                            <Ionicons name="arrow-back" size={100} color="black" style={styles.buttonControllerIcon} />
                        </ButtonControl>
                    </View>

                    <View
                        style={styles.buttonControllerRight}
                    >
                        <ButtonControl
                            onPress={() => changePower({ direction: 'right' })}
                        >
                            <Ionicons name="arrow-back" size={100} color="black" style={[styles.buttonControllerIcon, {
                                transform: [{ rotate: '180deg' }]
                            }]} />
                        </ButtonControl>
                    </View>

                    <View
                        style={styles.buttonControllerDown}
                    >
                        <ButtonControl
                            onPress={() => changePower({ direction: 'down' })}
                        >
                            <Ionicons name="arrow-back" size={100} color="black" style={[styles.buttonControllerIcon, {
                                transform: [{ rotate: '-90deg' }]
                            }]} />
                        </ButtonControl>
                    </View>

                    <View
                        style={[styles.buttonControllerItem, styles.buttonControllerCenter]}
                    >
                        {
                            connectedDevice ? (
                                <TouchableNativeFeedback
                                    onPress={() => disconnectFromDevice()}
                                >
                                    <View
                                        style={styles.buttonControllerItem}
                                    >
                                        <Ionicons name="power" size={50} color="black" style={styles.buttonControllerIcon} />
                                    </View>
                                </TouchableNativeFeedback>
                            ) : (
                                <TouchableNativeFeedback
                                    onPress={() => startStreamingData()}
                                >
                                    <View
                                        style={styles.buttonControllerItem}
                                    >
                                        <Ionicons name="power" size={50} color="black" style={styles.buttonControllerIcon} />
                                    </View>
                                </TouchableNativeFeedback>
                            )
                        }
                    </View>

                </ThemedView>
            </ThemedView>
        </ParallaxScrollView >
    );
}

const styles = StyleSheet.create({
    headerBackgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 250,
        zIndex: -1,
    },
    headerImage: {
        position: 'absolute',
        bottom: -80,
        left: SCREEN_WIDTH / 2 - 150,
        width: 300,
        height: 200,
        resizeMode: 'contain',
    },

    topContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 8,
    },

    powerPanelLeft: {
        width: 35,
        height: 180,
    },

    powerPanelRight: {
        width: 35,
        height: 180,
    },

    centerContainer: {
        width: 150,
        height: 150,
    },
    imageCharacter: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },

    buttonControllerOuter: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonControllers: {
        width: 300,
        height: 250,
    },

    buttonControllerItem: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    buttonControllerIcon: {
        borderRadius: 50,
    },

    buttonControllerLeft: {
        right: 180,
        top: 80,
    },
    buttonControllerRight: {
        left: 180,
        top: 80,
    },
    buttonControllerUp: {
        top: 0,
        left: 100,
    },
    buttonControllerDown: {
        bottom: 0,
        left: 100,
    },

    buttonControllerCenter: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        left: 125,
        top: 75,
    },
});
