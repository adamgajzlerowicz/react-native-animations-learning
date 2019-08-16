/**
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet, Image } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated, { Easing } from 'react-native-reanimated'
import { colors } from './themes'

const {
  View,
  event,
  Value,
  eq,
  cond,
  set,
  Clock,
  clockRunning,
  stopClock,
  startClock,
  call,
  divide,
  diff,
  add,
  and,
  multiply,
  lessThan,
  block,
  debug,
  timing
} = Animated

const interaction = (dragX, transY, gestureState, onDrop) => {
  const transX = new Value(0)
  const clock = new Clock()

  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  }

  const config = {
    duration: 200,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  }

  return block([
    cond(
      eq(gestureState, State.ACTIVE),
      [set(transX, dragX)],
      [
        cond(eq(gestureState, State.END), [
          set(gestureState, -1),
          set(state.finished, 0),
          set(state.time, 0),
          set(state.position, transX),
          set(state.frameTime, 0),

          startClock(clock)
        ])
      ]
    ),
    cond(clockRunning(clock), [
      timing(clock, state, config),
      set(transX, state.position),
      cond(state.finished, stopClock(clock))
    ]),
    transX
  ])
}

class App extends React.Component {
  gestureState = new Value(-1)

  dragX = new Value(0)
  dragY = new Value(0)
  transY = new Value()
  onGestureEvent = event([
    {
      nativeEvent: {
        translationX: this.dragX,
        translationY: this.dragY,
        state: this.gestureState
      }
    }
  ])

  constructor(props) {
    super(props)

    const { transY, dragY, gestureState, dragX, onDrop } = this

    this.translateY = cond(
      eq(this.gestureState, State.ACTIVE),
      [set(transY, dragY), transY]
      // [set(transY, 0)]
    )

    this.translateX = interaction(dragX, transY, gestureState, onDrop)
  }

  onDrop = ([x, y]) => {
    console.log(x, y)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
          >
            <Image source={require('./image.png')} style={styles.background} />
          </View>
        </PanGestureHandler>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
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
  }
})

export default App
