import React from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = PropsWithChildren<{
    maxPower: number;
    currentPower: number;
    onPowerChange: (power: number) => void;
}>;

export default function PowerPanel({ maxPower, currentPower, onPowerChange }: Props) {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: withTiming((1 - currentPower / maxPower) * 115, { duration: 500 }),
        };
    });

    return (
        <LinearGradient
            colors={['#f00', '#0f0']}
            style={styles.container}
        >
            <Animated.View
                style={[styles.animatedView, animatedStyle]}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: 120,
        width: 35,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden',
    },
    animatedView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 35,
        backgroundColor: "#fff",
    },
});