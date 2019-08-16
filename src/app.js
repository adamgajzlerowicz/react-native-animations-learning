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
  greaterThan,
  neq,
  multiply,
  lessThan,
  block,
  debug,
  timing
} = Animated

const startAnimationClock = (clock, state, startValue) =>
  block([
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, startValue),
    set(state.frameTime, 0),

    startClock(clock)
  ])

const interaction = ({ gestureValue, gestureState }) => {
  const returnValue = new Value(0)
  const clock = new Clock()
  const isDragging = new Value(false)
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
      [set(isDragging, true), set(returnValue, gestureValue)],
      [
        cond(eq(isDragging, true), [
          set(isDragging, false),
          startAnimationClock(clock, state, gestureValue)
        ])
      ]
    ),
    cond(clockRunning(clock), [
      timing(clock, state, config),
      set(returnValue, state.position),
      cond(state.finished, stopClock(clock))
    ]),
    returnValue
  ])
}

class App extends React.Component {
  gestureState = new Value(-1)

  dragX = new Value(0)
  dragY = new Value(0)
  opacity = new Value(0)

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

    const { dragY, gestureState, dragX } = this

    this.translateX = interaction({ gestureValue: dragX, gestureState })
    this.translateY = interaction({ gestureValue: dragY, gestureState })
    this.opacity = block([
      debug('i am here', new Value('meh')),
      cond(
        and(eq(gestureState, State.ACTIVE), greaterThan(dragX, 130)),
        [new Value(1)],
        [new Value(0)]
      )
    ])
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
            <View
              style={[
                styles.overlay,
                {
                  opacity: this.opacity
                }
              ]}
            />
          </View>
        </PanGestureHandler>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: colors.light
  },
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
