import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, PanResponder, View, Dimensions, Text } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const gridSize = screenWidth * .95;
const boxSize = gridSize / 4;
const MOVE_DURATION = 300;

const Box = ({ panResponder, box }) => {
    const pan = useRef(new Animated.ValueXY()).current;
    console.log(pan);

    // Animate box movement on load
    useEffect(() => {
        Animated.timing(
            pan, {
                toValue: { x: gridSize * (box.x / 4), y: gridSize * (box.y / 4) },
                duration: MOVE_DURATION,
                useNativeDriver: false
        }).start();
    }, []);
    // BUG: Learn how to get the box to animate from previous location to new location
    return (
        <Animated.View style={{
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            top: box.prevY*boxSize,
            left: box.prevX*boxSize
        }}
        {...panResponder.panHandlers}
          >
            <View style={styles.box}>
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