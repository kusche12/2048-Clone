import React, { useRef, useState } from 'react';
import Box from './box';
import { Animated, StyleSheet, PanResponder, View, Dimensions, Text } from 'react-native';
import _ from 'lodash';

const BOX_AMOUNT = 4;
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const gridSize = screenWidth * .95;
const GESTURE_THRESHOLD = .25 * screenWidth;

const startingData = [
  [
    { x: 0, y: 0, prevX: 0, prevY: 0, val: 2 },
    null,
    null,
    null,
    null,
    //{x: 3, y: 0, prevX: 3, prevY: 0, val: 4}
  ],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null]
]

export default function App() {
  const [boxes, setBoxes] = useState(startingData);
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = PanResponder.create({
    // Called any time the user taps on the screen
    // True represents that this should be in charge of user interaction
    onStartShouldSetPanResponder: () => true,

    // Called when user releases touch/takes finger off of screen
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > GESTURE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < GESTURE_THRESHOLD) {
        pan.setValue({ x: 0, y: 0 });
      }
    }
  });

  // Loop entire matrix, updating the pan and position for each box
  const swipeRight = () => {
    let newBoxes = _.cloneDeep(boxes); // Storage of new box location and values
    for (let i = 0; i < BOX_AMOUNT; i++) {
      for (let k = BOX_AMOUNT-2; k >= 0; k--) {
        // There's a box here
        if (newBoxes[i][k]) {
          let newX = k + 1;
          
          // There is no box to the right and has not reached the end
          while (!newBoxes[i][newX] && newX < BOX_AMOUNT) {
            newX++
          }

          // Reached another box
          if (newX != BOX_AMOUNT) {
            // If boxes are equal in value, combine them
            if (newBoxes[i][newX].val == boxes[i][k].val) {
              newBoxes[i][newX].val *= 2;
            }
          } else {
              // Reached end of row
              newBoxes[i][newX - 1] = newBoxes[i][k];
              newBoxes[i][newX - 1].prevX = newBoxes[i][k].x;
              newBoxes[i][newX - 1].x = newX - 1;
          }
          
          newBoxes[i][k] = null;
        }
      }
    }

    setBoxes(newBoxes);
    console.log(newBoxes);
  }

  const renderBoxes = () => {
    const allBoxes = [];
    for (let i = 0; i < boxes.length; i++) {
      boxes[i].map((box, index) => {
        if (box) {
          allBoxes.push(<Box panResponder={panResponder} box={box} key={index} />);
        }
      });
    }
    return allBoxes;
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {renderBoxes()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    backgroundColor: '#c2c2c2',
    width: gridSize,
    height: gridSize
  },
});