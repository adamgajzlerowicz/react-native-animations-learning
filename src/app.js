/**
 * @flow
 */

import React from 'react'
import { SafeAreaView, StyleSheet, Image, Text } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { colors } from './themes'
import {
  dragInteraction,
  getIsLikingValue,
  getIsDislikingValue
} from './animations'

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
  interpolate,
  neq,
  multiply,
  lessThan,
  block,
  debug,
  timing
} = Animated

class App extends React.Component {
  gestureState = new Value(-1)

  dragX = new Value(0)
  dragY = new Value(0)
  isLikingOpacity = new Value(0)
  isDislikingOpacity = new Value(0)

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

    this.translateX = dragInteraction({ gestureValue: dragX, gestureState })
    this.translateY = dragInteraction({ gestureValue: dragY, gestureState })
    this.isLikingOpacity = getIsLikingValue({
      gestureState,
      dragValue: dragX
    })
    this.isDislikingOpacity = getIsDislikingValue({
      gestureState,
      dragValue: dragX
    })
  }

  onDrop = ([x, y]) => {
    console.log(x, y)
  }

  render() {
    return (
      <View style={styles.container}>
        <PanGestureHandler
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
        >
          <View style={styles.container}>
            <View
              style={[
                styles.likeInfo,
                styles.dislikingInfo,
                {
                  opacity: this.isDislikingOpacity
                }
              ]}
            />
            <View
              style={[
                styles.likeInfo,
                styles.likingInfo,
                {
                  opacity: this.isLikingOpacity
                }
              ]}
            />

            <View
              style={[
                styles.box,
                {
                  transform: [
                    {
                      translateX: multiply(this.translateX, 1.5),
                      translateY: this.translateY,
                      rotate: multiply(this.translateX, 0.0009)
                    }
                  ]
                }
              ]}
            >
              <Image
                source={require('./image.png')}
                style={styles.background}
              />
            </View>

            <View
              style={[
                styles.overlay,
                styles.likingOverlay,
                {
                  opacity: interpolate(this.isLikingOpacity, {
                    inputRange: [0, 1],
                    outputRange: [0, 0.7]
                  })
                }
              ]}
            >
              <Text style={styles.textStyle}>Keep it</Text>
            </View>

            <View
              style={[
                styles.overlay,
                styles.dislikingOverlay,
                {
                  opacity: interpolate(this.isDislikingOpacity, {
                    inputRange: [0, 1],
                    outputRange: [0, 0.7]
                  })
                }
              ]}
            >
              <Text style={styles.textStyle}>Return it</Text>
            </View>
          </View>
        </PanGestureHandler>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Avenir',
    fontSize: 40,
    color: colors.white,
    fontWeight: '500'
  },
  likeInfo: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  likingInfo: {
    backgroundColor: colors.green
  },
  dislikingInfo: {
    backgroundColor: colors.red
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  likingOverlay: {
    backgroundColor: colors.green
  },
  dislikingOverlay: {
    backgroundColor: colors.red
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
