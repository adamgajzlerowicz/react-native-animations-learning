/**
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { colors } from './themes'

const { View, event, Value, eq, cond, set, Clock, stopClock, call } = Animated

class App extends React.Component {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
    this.translateX = new Value(0)
    this.translateY = new Value(0)
    const dragX = new Value(0)
    const dragY = new Value(0)
    const gestureState = new Value(-1)
    const dragVX = new Value(0)

    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: dragX,
          translationY: dragY,
          velocityX: dragVX,
          state: gestureState
        }
      }
    ])

    const clockX = new Clock()
    const transX = new Value()

    this.translateX = cond(
      eq(gestureState, State.ACTIVE),
      [stopClock(clockX), set(transX, dragX), transX],
      [set(transX, new Value(0))]
    )

    const clockY = new Clock()
    const transY = new Value()

    this.translateY = cond(
      eq(gestureState, State.ACTIVE),
      [stopClock(clockY), set(transY, dragY), transY],
      [
        cond(eq(gestureState, State.END), call([transX, transY], this.onDrop)),
        set(transY, new Value(0))
      ]
    )
  }

  onDrop = ([x, y]) => {
    console.log(x, y)
  }

  react = e => {
    const { width, height, x, y } = e.nativeEvent.layout

    this.top = y
    this.bottom = y + height
    this.left = x
    this.right = x + width
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.like, styles.dropArea]} />
        <View style={[styles.dislike, styles.dropArea]} onLayout={this.react} />
        <PanGestureHandler
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: this.translateX },
                  { translateY: this.translateY }
                ]
              }
            ]}
          />
        </PanGestureHandler>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: colors.primary,
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  box: {
    backgroundColor: colors.light,
    flex: 1
  },
  dropArea: {
    position: 'absolute',
    width: '25%',
    height: '100%',
    top: 0,
    bottom: 0
  },
  like: {
    backgroundColor: 'green',
    right: 0
  },
  dislike: {
    backgroundColor: 'red',
    left: 0
  }
})

export default App
