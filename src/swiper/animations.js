import Animated, { Easing } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import {
  distanceToVote,
  throwOutDuration,
  throwOutDistance,
  returnDuration,
  distanceToSkip,
  skipDistance,
  YSpeedMultiplier,
  XSpeedMultiplier
} from './constants'

const {
  debug,
  multiply,
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
  interpolate,
  or,
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

export const noAction = (dragX, dragY) =>
  or(
    lessThan(abs(dragX), distanceToVote),
    and(greaterThan(abs(dragY), distanceToSkip), lessThan(dragY, 0))
  )

export const dragInteraction = ({
  dragX,
  dragY,
  gestureState,
  reaction,
  nextSlide,
  transXValue,
  transYValue
}) => {
  const xClock = new Clock()
  const yClock = new Clock()

  const clockState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  }

  const clockConfig = {
    duration: new Value(0),
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  }

  const yClockState = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  }

  const yClockConfig = {
    duration: new Value(1000),
    toValue: new Value(-skipDistance),
    easing: Easing.inOut(Easing.ease)
  }

  return block([
    cond(
      eq(gestureState, State.ACTIVE),
      [
        set(transXValue, multiply(dragX, XSpeedMultiplier)),
        set(transYValue, multiply(dragY, YSpeedMultiplier))
      ],
      [
        cond(
          and(
            eq(gestureState, State.END),
            eq(clockRunning(xClock), false),
            eq(clockRunning(yClock), false)
          ),
          cond(
            // should return to original position ?
            and(
              lessThan(abs(dragX), distanceToVote),
              or(lessThan(abs(dragY), distanceToSkip), greaterThan(dragY, 0))
            ),
            [
              set(clockConfig.toValue, 0),
              set(yClockConfig.toValue, 0),
              set(clockConfig.duration, returnDuration),
              set(yClockConfig.duration, returnDuration),
              block([
                startCardClock(xClock, clockState, dragX),
                startCardClock(yClock, yClockState, dragY)
              ])
            ],
            [
              call([transXValue, dragY], reaction),
              cond(
                and(
                  greaterThan(abs(dragY), distanceToSkip),
                  lessThan(dragY, 0)
                ),
                // skip clock start
                [
                  set(yClockConfig.duration, throwOutDuration),
                  startCardClock(
                    yClock,
                    yClockState,
                    multiply(dragY, new Value(YSpeedMultiplier))
                  )
                ],
                // vote clock start
                [
                  set(
                    clockConfig.toValue,
                    cond(
                      lessThan(dragX, 0),
                      -throwOutDistance,
                      throwOutDistance
                    )
                  ),
                  set(clockConfig.duration, throwOutDuration),
                  startCardClock(xClock, clockState, dragX)
                ]
              )
            ]
          )
        )
      ]
    ),
    cond(clockRunning(yClock), [
      timing(yClock, yClockState, yClockConfig),
      set(transYValue, yClockState.position),
      cond(yClockState.finished, [
        stopClock(yClock),
        cond(
          and(greaterThan(abs(dragY), distanceToSkip), lessThan(dragY, 0)),
          call([], nextSlide)
        )
      ])
    ]),
    cond(clockRunning(xClock), [
      timing(xClock, clockState, clockConfig),
      set(transXValue, clockState.position),
      cond(clockState.finished, [
        stopClock(xClock),
        cond(
          greaterOrEq(abs(clockState.position), throwOutDistance),
          call([], nextSlide)
        )
      ])
    ]),
    cond(
      and(
        eq(clockRunning(xClock), false),
        eq(clockRunning(yClock), false),
        eq(gestureState, State.END)
      ),
      set(gestureState, State.UNDETERMINED)
    ),
    transXValue
  ])
}
