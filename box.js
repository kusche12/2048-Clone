import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Dimensions, Text } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const gridSize = screenWidth * .95;
const boxSize = gridSize / 4;
const MOVE_DURATION = 300;

const Box = ({ color, box }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    pan.setValue({x: -1 * boxSize * box.deltaX, y: 0});

    // Animate box movement on load
    useEffect(() => {
        Animated.timing(
            pan, {
                toValue: { x: 0, y: 0 },
                duration: MOVE_DURATION,
                useNativeDriver: false
        }).start();
    }, [box]);
    return (
        <Animated.View style={{transform: [{ translateX: pan.x }, { translateY: pan.y }]}}>
            <View style={[styles.box, {backgroundColor: color}]}>
                <Text style={styles.text}>{box.val}</Text>
          </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: '#ffefb0',
        width: boxSize,
        height: boxSize,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#666666'
    }
});

export default Box;