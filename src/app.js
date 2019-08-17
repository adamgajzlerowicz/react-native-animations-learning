import React from 'react'
import { StyleSheet, View } from 'react-native'

import Swiper from './swiper'

export default () => (
  <View style={styles.container}>
    <Swiper />
    <Swiper />
    <Swiper />
  </View>
)

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1
  }
})
