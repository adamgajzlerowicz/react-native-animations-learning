import React from 'react'
import Animated from 'react-native-reanimated'
import { StyleSheet, Text } from 'react-native'
import { colors } from '../themes'

const { View, interpolate } = Animated

export default ({ opacity, text, style }) => (
  <View
    style={[
      styles.overlayContainer,
      {
        opacity
      }
    ]}
  >
    <View
      style={[
        styles.opaqueBackground,
        style,
        {
          opacity: interpolate(opacity, {
            inputRange: [0, 1],
            outputRange: [0, 0.7]
          })
        }
      ]}
    />
    <Text style={styles.textStyle}>{text}</Text>
  </View>
)

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: 'Avenir',
    fontSize: 40,
    color: colors.white,
    fontWeight: '500'
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
  }
})
