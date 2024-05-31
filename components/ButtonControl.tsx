import { PropsWithChildren, ReactElement } from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';

type Props = PropsWithChildren<{
    onPress: () => void;
}>;


export default function ButtonControl({ children, onPress }: Props) {
    return (
        <View
            style={styles.buttonControllerItem}
        >
            <TouchableNativeFeedback
                onPress={() => onPress()}
            >
                <View
                    style={styles.buttonControllerItem}
                >
                    {children}
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
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
});