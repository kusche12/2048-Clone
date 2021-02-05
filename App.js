import React, { useRef, useState } from 'react';
import Box from './box';
import EmptyBox from './EmptyBox';
import { Animated, StyleSheet, PanResponder, View, Dimensions } from 'react-native';
import { colors } from './ColorMap.js';
import _ from 'lodash';

const BOX_AMOUNT = 4;
const screenWidth = Math.round(Dimensions.get('window').width);
const gridSize = screenWidth * .95;
const boxSize = gridSize / 4;
const GESTURE_THRESHOLD = .25 * screenWidth;

const startingData = [
  [
    { x: 0, y: 0, deltaX: 0, deltaY: 0, val: 2 },
    null,
    null,
    //null,
    {x: 3, y: 0, deltaX: 0, deltaY: 0, val: 4 }
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

          // Reached another box and theyre equal, combine them
          if (newX != BOX_AMOUNT && newBoxes[i][newX].val == newBoxes[i][k].val) {
            newBoxes[i][newX].val *= 2;
            newBoxes[i][newX].deltaX = newX;
            newBoxes[i][newX].x = newX;
          // Reached end of row or an unequal box
          } else {
            newBoxes[i][newX - 1] = newBoxes[i][k];
            newBoxes[i][newX - 1].deltaX = newX - 1;
            newBoxes[i][newX - 1].x = newX - 1;
          }
          
          if (newX > k + 1) newBoxes[i][k] = null;
        }
      }
    }

    setBoxes(newBoxes);
  }

  const getColor = (val) => {
    return colors.get(val);
  }

  const renderBoxes = () => {
    console.log("RERENDERING");
    const allBoxes = [];
    let idx = 0;
    for (let i = 0; i < BOX_AMOUNT; i++) {
      boxes[i].map((box) => {
        idx++;
        if (box) {
          let color = getColor(box.val);
          allBoxes.push(<Box box={box} key={idx} color={color} />);
        } else {
          allBoxes.push(<EmptyBox key={idx}/>);
        }
      });
    }
    return allBoxes;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.grid} {...panResponder.panHandlers}>
        {renderBoxes()}
      </Animated.View>
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
    height: gridSize,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});