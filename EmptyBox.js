import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const gridSize = screenWidth * .95;
const boxSize = gridSize / 4;

const Box = () => {
    return (
        <View style={styles.box}></View>
    )
}

const styles = StyleSheet.create({
    box: {
        //backgroundColor: '#c2c2c2',
        backgroundColor: '#c2c2c2',
        width: boxSize,
        height: boxSize,
        justifyContent: 'center',
        alignItems: 'center'
    },

});

export default Box;