import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, ScrollView, Image, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Animated from 'react-native-reanimated';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import PowerPanel from '@/components/PowerPanel';
import ParallaxScrollView from '@/components/ParallaxScrollViewBoat';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BoatControllerScreen() {
    const maxPower = 180;
    const [powerLeft, setPowerLeft] = useState(0);
    const [powerRight, setPowerRight] = useState(0);

    const changePower = (request: {direction: string}) => {
        if (request.direction === 'left') {
            setPowerLeft(powerLeft + 10 < maxPower ? powerLeft + 10 : maxPower);
        } else if (request.direction === 'right') {
            setPowerRight(powerRight + 10 < maxPower ? powerRight + 10 : maxPower);
        } else if (request.direction === 'up') {
            setPowerLeft(powerLeft + 10 < maxPower ? powerLeft + 10 : maxPower);
            setPowerRight(powerRight + 10 < maxPower ? powerRight + 10 : maxPower);
        } else if (request.direction === 'down') {
            setPowerLeft(powerLeft - 10 < 0 ? 0 : powerLeft - 10);
            setPowerRight(powerRight - 10 < 0 ? 0 : powerRight - 10);
        }
    }

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
                    </View>
                </View>
            </ThemedView>
            <ThemedView
                style={styles.buttonControllerOuter}
            >
                <ThemedView
                    style={styles.buttonController}
                >

                    <View
                        style={[styles.buttonControllerItem, styles.buttonControllerLeft]}
                    >
                        <TouchableNativeFeedback
                            onPress={() => changePower({ direction: 'left' })}
                        >
                            <View
                                style={styles.buttonControllerItem}
                            >
                                <Ionicons name="arrow-back" size={100} color="black" style={styles.buttonControllerIcon} />
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                    <View
                        style={[styles.buttonControllerItem, styles.buttonControllerRight]}
                    >
                        <TouchableNativeFeedback
                            onPress={() => changePower({ direction: 'right' })}
                        >
                            <View
                                style={styles.buttonControllerItem}
                            >
                                <Ionicons name="arrow-back" size={100} color="black" style={[styles.buttonControllerIcon, {
                                    transform: [{ rotate: '180deg' }]
                                }]} />
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                    <View
                        style={[styles.buttonControllerItem, styles.buttonControllerUp]}
                    >
                        <TouchableNativeFeedback
                            onPress={() => changePower({ direction: 'up' })}
                        >
                            <View
                                style={styles.buttonControllerItem}
                            >
                                <Ionicons name="arrow-back" size={100} color="black" style={[styles.buttonControllerIcon, {
                                    transform: [{ rotate: '90deg' }]
                                }]} />
                            </View>
                        </TouchableNativeFeedback>
                    </View>

                    <View
                        style={[styles.buttonControllerItem, styles.buttonControllerDown]}
                    >
                        <TouchableNativeFeedback
                            onPress={() => changePower({ direction: 'down' })}
                        >
                            <View
                                style={styles.buttonControllerItem}
                            >
                                <Ionicons name="arrow-back" size={100} color="black" style={[styles.buttonControllerIcon, {
                                    transform: [{ rotate: '-90deg' }]
                                }]} />
                            </View>
                        </TouchableNativeFeedback>
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
    buttonController: {
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
});
