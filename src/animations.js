import Animated, { Easing } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'

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
const deviceWidth = Dimensions.get('window').width

const makeLikingValue = ({ gestureState, condition }) =>
  block([
    cond(
      and(eq(gestureState, State.ACTIVE), condition),
      [new Value(0.7)],
      [new Value(0)]
    )
  ])

export const getIsLikingValue = ({ gestureState, dragValue }) =>
  makeLikingValue({
    gestureState,
    condition: greaterThan(dragValue, deviceWidth / 6)
  })

export const getIsDislikingValue = ({ gestureState, dragValue }) =>
  makeLikingValue({
    gestureState,
    condition: lessThan(dragValue, -(deviceWidth / 6))
  })

const startAnimationClock = (clock, state, startValue) =>
  block([
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, startValue),
    set(state.frameTime, 0),

    startClock(clock)
  ])

export const dragInteraction = ({ gestureValue, gestureState }) => {
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
