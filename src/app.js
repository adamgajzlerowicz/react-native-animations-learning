import React from 'react'
import { StyleSheet, View } from 'react-native'

import Swiper from './swiper'

function minTwoDigits(n) {
  return (n < 10 ? '0' : '') + n
}

const items = []

for (let i = 1; i < 4; i++) {
  items.push({
    id: i,
    url: `https://black-dev-static.s3-eu-west-1.amazonaws.com/flip_pic/seed/women/${minTwoDigits(
      i
    )}.jpg`
  })
}

export default () => (
  <View style={styles.container}>
    <Swiper items={items} callback={console.log} />
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
