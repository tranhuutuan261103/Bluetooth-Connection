import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, ScrollView, Image, Button } from 'react-native';
import Animated from 'react-native-reanimated';

import { StyleSheet, NativeModules, NativeEventEmitter } from 'react-native';
import { Link } from 'expo-router';
import PowerPanel from '@/components/PowerPanel';
import ParallaxScrollView from '@/components/ParallaxScrollViewBoat';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BoatControllerScreen() {


    return (
        <ParallaxScrollView
            headerBackgroundImage={<Animated.Image source={require('../../assets/images/sea.gif')} style={styles.headerBackgroundImage} />}
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={<Animated.Image source={require('../../assets/images/boat.png')} style={styles.headerImage} />}>
            <ThemedView style={styles.titleContainer}>
                <View>
                    <PowerPanel currentPower={19} maxPower={24} onPowerChange={() => console.log("123")} />
                </View>
            </ThemedView>
            
        </ParallaxScrollView>
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
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
