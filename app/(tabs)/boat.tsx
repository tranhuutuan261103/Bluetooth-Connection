import React, { useEffect, useState } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import Ionicons from '@expo/vector-icons/Ionicons';
import ButtonControl from '@/components/ButtonControl';
import PowerPanel from '@/components/PowerPanel';
import ParallaxScrollView from '@/components/ParallaxScrollViewBoat';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const colors = {
    button: 'blue',
};

import useBle from '@/hooks/useBle';

export default function BoatControllerScreen() {
    const {
        connectedDevice,
        streamData,

        requestPermission,

        connectToDevice,
        disconnectFromDevice,

        sendDataStream,
    } = useBle();

    const maxPower = 50;
    const [powerLeft, setPowerLeft] = useState(0);
    const [powerRight, setPowerRight] = useState(0);

    const changePower = (request: { direction: string }) => {
        if (request.direction === 'left') {
            sendDataStream(`a`);
        } else if (request.direction === 'right') {
            sendDataStream(`d`);
        } else if (request.direction === 'up') {
            sendDataStream(`w`);
        } else if (request.direction === 'down') {
            sendDataStream(`s`);
        } else if (request.direction === 'stop') {
            sendDataStream(`x`);
        }
    }

    const extractData = (data: string) => {
        const [left, right] = data.split(',');
        setPowerLeft(parseFloat(left));
        setPowerRight(parseFloat(right));
    }

    useEffect(() => {
        if (connectedDevice && streamData) {
            extractData(streamData);
        }
    }, [streamData]);

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
                        <ThemedText style={{ textAlign: 'center' }}>{powerLeft}</ThemedText>
                        <ThemedText style={{ textAlign: 'center' }}>cm/s</ThemedText>
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
                        <ThemedText style={{ textAlign: 'center' }}>{powerRight}</ThemedText>
                        <ThemedText style={{ textAlign: 'center' }}>cm/s</ThemedText>
                    </View>
                </View>
            </ThemedView>
            <ThemedView
                style={styles.buttonControllerOuter}
            >
                <ThemedView
                    style={styles.buttonControllers}
                >
                    {
                        connectedDevice ? (
                            <>
                                <View
                                    style={[styles.buttonControllerItem, styles.buttonControllerUp]}
                                >
                                    <ButtonControl
                                        onPressIn={() => changePower({ direction: 'up' })}
                                        onPressOut={() => changePower({ direction: 'stop' })}
                                    >
                                        <Ionicons name="arrow-back" size={100} color={colors.button} style={[styles.buttonControllerIcon, {
                                            transform: [{ rotate: '90deg' }]
                                        }]} />
                                    </ButtonControl>
                                </View>

                                <View
                                    style={[styles.buttonControllerItem, styles.buttonControllerLeft]}
                                >
                                    <ButtonControl
                                        onPressIn={() => changePower({ direction: 'left' })}
                                        onPressOut={() => changePower({ direction: 'stop' })}
                                    >
                                        <Ionicons name="arrow-back" size={100} color={colors.button} style={styles.buttonControllerIcon} />
                                    </ButtonControl>
                                </View>

                                <View
                                    style={[styles.buttonControllerItem, styles.buttonControllerRight]}
                                >
                                    <ButtonControl
                                        onPressIn={() => changePower({ direction: 'right' })}
                                        onPressOut={() => changePower({ direction: 'stop' })}
                                    >
                                        <Ionicons name="arrow-back" size={100} color={colors.button} style={[styles.buttonControllerIcon, {
                                            transform: [{ rotate: '180deg' }]
                                        }]} />
                                    </ButtonControl>
                                </View>

                                <View
                                    style={[styles.buttonControllerItem, styles.buttonControllerDown]}
                                >
                                    <ButtonControl
                                        onPressIn={() => changePower({ direction: 'down' })}
                                        onPressOut={() => changePower({ direction: 'stop' })}
                                    >
                                        <Ionicons name="arrow-back" size={100} color={colors.button} style={[styles.buttonControllerIcon, {
                                            transform: [{ rotate: '-90deg' }]
                                        }]} />
                                    </ButtonControl>
                                </View>

                                <View
                                style={[styles.buttonControllerItem, styles.buttonControllerCenter]}
                            >
                                <ButtonControl
                                    onPressIn={() => disconnectFromDevice()}
                                    onPressOut={() => {}}
                                >
                                    <Ionicons name="power" size={50} color="red" style={styles.buttonControllerIcon} />
                                </ButtonControl>
                            </View>
                            </>
                        ) : (
                            <View
                                style={[styles.buttonControllerItem, styles.buttonControllerCenter]}
                            >
                                <ButtonControl
                                    onPressIn={() => connectToDevice("4C:24:98:2C:1C:1F")}
                                    onPressOut={() => {}}
                                >
                                    <Ionicons name="bluetooth" size={50} color="green" style={styles.buttonControllerIcon} />
                                </ButtonControl>
                            </View>
                        )
                    }
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
        alignItems: 'center',
        width: 55,
        height: 160,
    },

    powerPanelRight: {
        alignItems: 'center',
        width: 55,
        height: 160,
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
        position: 'relative',
        width: SCREEN_WIDTH,
        height: 300,
    },

    buttonControllerItem: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    buttonControllerIcon: {
        borderRadius: 50,
    },

    buttonControllerLeft: {
        left: 20,
        top: 100,
    },
    buttonControllerRight: {
        right: 20,
        top: 100,
    },
    buttonControllerUp: {
        top: 0,
        left: SCREEN_WIDTH / 2 - 50,
    },
    buttonControllerDown: {
        bottom: 0,
        left: SCREEN_WIDTH / 2 - 50,
    },

    buttonControllerCenter: {
        position: 'absolute',
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        left: SCREEN_WIDTH / 2 - 40,
        top: 110,
    },
});
