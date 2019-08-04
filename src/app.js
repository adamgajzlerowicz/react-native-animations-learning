/**
 * @flow
 */

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { colors } from './themes';

const { View, event, Value, cond, eq } = Animated;

class App extends React.Component {
  constructor(props) {
    super(props);
    const state = new Value(-1);
    this.onStateChange = event([
      {
        nativeEvent: { state },
      },
    ]);

    this._opacity = cond(eq(state, State.BEGAN), 0.3, 1);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TapGestureHandler onHandlerStateChange={this.onStateChange}>
          <View style={[styles.box, { opacity: this._opacity }]} />
        </TapGestureHandler>
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
