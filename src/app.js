/**
 * @flow
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { colors } from './themes';

const { View, event, Value, eq, cond, set } = Animated;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.translateX = new Value(0);
    const dragX = new Value(0);
    const state = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: { translationX: dragX, state }
      }
    ]);

    const transX = new Value();
    this.translateX = cond(
      eq(state, State.ACTIVE),
      [set(transX, dragX), transX],
      [set(transX, 0), transX]
    );
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
              { transform: [{ translateX: this.translateX }] }
            ]}
          />
        </PanGestureHandler>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  box: {
    backgroundColor: colors.light,
    width: 100,
    height: 100
  }
});

export default App;
