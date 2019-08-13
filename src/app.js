/**
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { colors } from './themes'

const {
  View,
  event,
  Value,
  eq,
  cond,
  set,
  Clock,
  stopClock,
  startClock,
  call,
  divide,
  diff,
  add,
  and,
  multiply,
  lessThan
} = Animated

const interaction = (dragX, transY, gestureState, onDrop) => {
  const POSITION_THRESHOLD = 10
  const VELOCITY = 1000

  const transX = new Value()
  const dragging = new Value(false)
  const start = new Value(0)
  const velocity = new Value(0)

  const clock = new Clock()
  const dt = divide(diff(clock), 1000)

  return cond(
    eq(gestureState, State.ACTIVE),
    [
      cond(eq(dragging, false), [set(dragging, true), set(start, transX)]),
      stopClock(clock),
      dt,
      set(transX, add(dragX, start))
    ],
    [
      cond(
        and(eq(gestureState, State.END), eq(dragging, true)),
        call([transX, transY], onDrop)
      ),
      set(dragging, false),
      startClock(clock),
      set(velocity, cond(lessThan(transX, 0), VELOCITY, -VELOCITY)),
      cond(
        and(
          lessThan(transX, POSITION_THRESHOLD),
          lessThan(-POSITION_THRESHOLD, transX)
        ),
        [stopClock(clock), set(velocity, 0), set(transX, 0)]
      ),
      set(transX, add(transX, multiply(velocity, dt)))
    ]
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.onDrop = this.onDrop.bind(this)
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

    const transY = new Value()

    this.translateY = cond(
      eq(gestureState, State.ACTIVE),
      [set(transY, dragY), transY],
      [set(transY, 0)]
    )

    this.translateX = interaction(dragX, transY, gestureState, this.onDrop)
  }

  onDrop = ([x, y]) => {
    console.log(x, y)
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
                  {
                    translateX: this.translateX,
                    translateY: this.translateY,
                    rotate: multiply(this.translateX, 0.0009)
                  }
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
