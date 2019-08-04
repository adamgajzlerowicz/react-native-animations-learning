/**
 * @flow
 */

import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { colors } from './themes';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TapGestureHandler
          onHandlerStateChange={e => {
            console.log(e);
          }}
        >
          <View style={styles.box} />
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
    width: 150,
    height: 150
  }
});

export default App;
