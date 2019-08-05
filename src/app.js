/**
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import { colors } from './themes'
import { runSpring } from './animations'

const {
  View,
  event,
  Value,
  eq,
  cond,
  set,
  defined,
  Clock,
  stopClock
} = Animated

class App extends React.Component {
  constructor(props) {
    super(props)
    this.translateX = new Value(0)
    this.translateY = new Value(0)
    const dragX = new Value(0)
    const dragY = new Value(0)
    const state = new Value(-1)
    const dragVX = new Value(0)

    this.onGestureEvent = event([
      {
        nativeEvent: {
          translationX: dragX,
          translationY: dragY,
          velocityX: dragVX,
          state
        }
      }
    ])

    const clockX = new Clock()
    const transX = new Value()

    this.translateX = cond(
      eq(state, State.ACTIVE),
      [stopClock(clockX), set(transX, dragX), transX],
      [
        set(
          transX,
          cond(defined(transX), runSpring(clockX, transX, dragVX, 0), 0)
        )
      ]
    )

    const clockY = new Clock()
    const transY = new Value()

    this.translateY = cond(
      eq(state, State.ACTIVE),
      [stopClock(clockY), set(transY, dragY), transY],
      [
        set(
          transY,
          cond(defined(transY), runSpring(clockY, transY, dragVX, 0), 0)
        )
      ]
    )
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
    backgroundColor: colors.primary,
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  box: {
    backgroundColor: colors.light,
    flex: 1,
  }
})

export default App
