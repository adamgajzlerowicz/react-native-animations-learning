import Animated, { Easing } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import {
  distanceToVote,
  throwOutDuration,
  throwOutDistance,
  returnDuration,
  distanceToSkip
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
  greaterThan,
  call,
  greaterOrEq,
  abs,
  and,
  lessThan,
  block,
  or,
  not,
  timing
} = Animated

const startCardClock = (clock, state, startValue) =>
  block([
    set(state.finished, 0),
    set(state.time, 0),
    set(state.position, startValue),
    set(state.frameTime, 0),

    startClock(clock)
  ])

export const willSkip = (dragX, dragY) =>
  and(
    or(
      lessThan(abs(dragX), distanceToVote),
      greaterThan(abs(dragY), distanceToSkip)
    ),
    lessThan(dragY, 0)
  )

export const dragInteractionX = ({
  dragX,
  dragY,
  gestureState,
  reaction,
  nextSlide,
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
      [set(transXValue, dragX)],
      [
        cond(
          and(eq(gestureState, State.END), eq(clockRunning(clock), false)),
          cond(
            willSkip(dragX, dragY),
            [
              debug('here', dragY),
              set(clockConfig.toValue, 0),
              set(clockConfig.duration, returnDuration),
              startCardClock(clock, clockState, dragX)
            ],
            [
              set(clockConfig.duration, throwOutDuration),
              [
                set(
                  clockConfig.toValue,
                  cond(lessThan(dragX, 0), -throwOutDistance, throwOutDistance)
                ),
                call([transXValue], reaction),
                startCardClock(clock, clockState, dragX)
              ]
            ]
          )
        )
      ]
    ),
    cond(clockRunning(clock), [
      timing(clock, clockState, clockConfig),
      set(transXValue, clockState.position),
      set(gestureState, State.UNDETERMINED),
      cond(clockState.finished, [
        stopClock(clock),
        cond(
          greaterOrEq(abs(clockState.position), throwOutDistance),
          call([], nextSlide)
        )
      ])
    ]),
    transXValue
  ])
}
