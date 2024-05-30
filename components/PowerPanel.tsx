import Animated, {
    useAnimatedStyle,
} from "react-native-reanimated";
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

type Props = PropsWithChildren<{
    maxPower: number;
    currentPower: number;
    onPowerChange: (power: number) => void;
}>;

export default function PowerPanel({ maxPower, currentPower, onPowerChange }: Props) {
    const powerCurrentColor = useAnimatedStyle(() => {
        const colorScale = currentPower / maxPower;
        return {
            backgroundColor: `rgb(${colorScale * 255}, ${(1 - colorScale) * 255}, 0)`,
            height: `${(currentPower / maxPower) * 100}%`,
        };
    });
    

    return (
        <Animated.View style={styles.container}>
            <LinearGradient
                colors={['#00ff00', '#ff0000']}
                style={styles.container}
            ></LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: 200,
        width: 40,
        backgroundColor: 'rgb(44, 44, 44)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden',
    }
});