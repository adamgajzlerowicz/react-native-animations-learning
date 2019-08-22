import Animated, { Easing } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import {
  distanceToVote,
  throwOutDuration,
  throwOutDistance,
  returnDuration
} from './constants'

const {
  debug,
  Value,
  eq,
  cond,
  set,
  Clock,
  clockRunning,
  stopClock,
  startClock,
  call,
  abs,
  and,
  greaterThan,
  lessThan,
  block,
  multiply,
  timing
} = Animated

const makeLikingValue = ({ gestureState, condition }) =>
  cond(
    new Value(0),
    cond(
      and(eq(gestureState, State.ACTIVE), condition),
      [new Value(1)],
      [new Value(0)]
    )
  )

export const getIsLikingValue = ({ gestureState, dragValue }) =>
  makeLikingValue({
    gestureState,
    condition: greaterThan(dragValue, distanceToVote)
  })

export const getIsDislikingValue = ({ gestureState, dragValue }) =>
  makeLikingValue({
    gestureState,
    condition: lessThan(dragValue, -distanceToVote)
  })

const startCardClock = (clock, state, startValue) =>
  block([
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, startValue),
    set(state.frameTime, 0),

    startClock(clock)
  ])

export const dragInteractionX = ({
  gestureValue,
  gestureState,
  reaction,
  reset,
  transXValue
}) => {
  const clock = new Clock()

  const clockState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  }

  const clockConfig = {
    duration: new Value(100),
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  }

  return block([
    cond(
      eq(gestureState, State.ACTIVE),
      [set(transXValue, gestureValue)],
      [
        cond(
          and(eq(gestureState, State.END), eq(clockRunning(clock), false)),
          cond(
            lessThan(abs(gestureValue), distanceToVote),
            [
              set(clockConfig.toValue, 0),
              set(clockConfig.duration, returnDuration),
              startCardClock(clock, clockState, gestureValue)
            ],
            [
              set(clockConfig.duration, throwOutDuration),
              [
                set(
                  clockConfig.toValue,
                  cond(
                    lessThan(gestureValue, 0),
                    -throwOutDistance,
                    throwOutDistance
                  )
                ),
                call([transXValue], reaction),
                startCardClock(clock, clockState, gestureValue)
              ]
            ]
          )
        )
      ]
    ),
    cond(clockRunning(clock), [
      timing(clock, clockState, clockConfig),
      set(transXValue, clockConfig.toValue),
      set(gestureState, State.UNDETERMINED),

      cond(clockState.finished, [
        stopClock(clock),
        call([], reset),
        set(clockState.finished, 0),
        set(clockState.time, 0),
        set(clockState.frameTime, 0)
      ])
    ]),
    transXValue
  ])
}
