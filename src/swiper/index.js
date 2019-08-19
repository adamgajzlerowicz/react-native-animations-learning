/**
 * @flow
 */

import React from 'react'
import { StyleSheet, Text, Image } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

import { colors } from '../themes'
import {
  dragInteraction,
  getIsLikingValue,
  getIsDislikingValue
} from './animations'

const { View, event, Value, interpolate, multiply } = Animated

class App extends React.Component {
  gestureState = new Value(-1)

  dragX = new Value(0)
  dragY = new Value(0)
  isLikingOpacity = new Value(0)
  isDislikingOpacity = new Value(0)
  hasVoted = new Value(false)

  state = {
    items: []
  }

  onGestureEvent = event([
    {
      nativeEvent: {
        translationX: this.dragX,
        translationY: this.dragY,
        state: this.gestureState
      }
    }
  ])

  setNextSlide = () => {
    // eslint-disable-next-line no-unused-vars
    const [_oldTopItem, ...items] = this.state.items

    this.setState({
      items
    })
  }

  constructor(props) {
    super(props)
    const { dragY, gestureState, dragX, hasVoted } = this
    const { callback, items } = this.props

    this.state.items = items

    this.translateX = dragInteraction({
      gestureValue: dragX,
      gestureState,
      reaction: data => {
        callback(data)
      },
      setNextSlide: () => {
        this.setNextSlide()
      },
      hasVoted
    })

    // this.translateY = dragInteraction({
    //   gestureValue: dragY,
    //   gestureState,
    //   callback: data => {
    //     // this.onVote()
    //     // callback(data)
    //   },
    //   hasVoted
    // })
    this.translateY = new Value(0)

    this.isLikingOpacity = getIsLikingValue({
      gestureState,
      dragValue: dragX,
      hasVoted
    })

    this.isDislikingOpacity = getIsDislikingValue({
      gestureState,
      dragValue: dragX,
      hasVoted
    })
  }

  render() {
    const [interactiveItem, backgroundItem] = this.state.items

    console.log(this.state.items)

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

            <View style={[styles.box]}>
              <Image
                source={{
                  uri: backgroundItem.url
                }}
                style={styles.background}
              />
            </View>

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
                source={{
                  uri: interactiveItem.url
                }}
                style={styles.background}
              />
            </View>

            <View
              style={[
                styles.overlayContainer,
                {
                  opacity: this.isLikingOpacity
                }
              ]}
            >
              <View
                style={[
                  styles.opaqueBackground,
                  styles.likingOverlay,
                  {
                    opacity: interpolate(this.isLikingOpacity, {
                      inputRange: [0, 1],
                      outputRange: [0, 0.7]
                    })
                  }
                ]}
              />
              <Text style={styles.textStyle}>Keep it</Text>
            </View>

            <View
              style={[
                styles.overlayContainer,
                {
                  opacity: this.isDislikingOpacity
                }
              ]}
            >
              <View
                style={[
                  styles.opaqueBackground,
                  styles.dislikingOverlay,
                  {
                    opacity: interpolate(this.isDislikingOpacity, {
                      inputRange: [0, 1],
                      outputRange: [0, 0.7]
                    })
                  }
                ]}
              />
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
  overlayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  opaqueBackground: {
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
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  },
  box: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
})

export default App
