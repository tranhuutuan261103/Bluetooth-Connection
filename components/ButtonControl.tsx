import { PropsWithChildren } from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';

type Props = PropsWithChildren<{
    onPressIn: () => void;
    onPressOut: () => void;
}>;

export default function ButtonControl({ children, onPressIn, onPressOut }: Props) {
    return (
        <View style={styles.buttonControllerItem}>
            <TouchableNativeFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
                <View style={styles.buttonContent}>
                    {children}
                </View>
            </TouchableNativeFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonControllerItem: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        overflow: 'hidden', // ensures the borderRadius is applied correctly
    },
    buttonContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
    },
});