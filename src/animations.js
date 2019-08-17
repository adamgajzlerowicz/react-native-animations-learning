import Animated, { Easing } from 'react-native-reanimated'
import { State } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'

const {
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
  timing
} = Animated

const deviceWidth = Dimensions.get('window').width
const distanceToVote = deviceWidth / 6
const throwOutDistance = deviceWidth * 2
const throwOutSpeed = 500

const makeLikingValue = ({ gestureState, condition }) =>
  block([
    cond(
      and(eq(gestureState, State.ACTIVE), condition),
      [new Value(1)],
      [new Value(0)]
    )
  ])

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

export const dragInteraction = ({
  gestureValue,
  gestureState,
  onLike = () => console.log('liked'),
  onDislike = () => console.log('disliked')
}) => {
  const returnValue = new Value(0)
  const clock = new Clock()
  const isDragging = new Value(false)
  const hasVoted = new Value(false)

  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  }

  const config = {
    duration: new Value(100),
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  }

  return block([
    cond(
      eq(gestureState, State.ACTIVE),
      [set(isDragging, true), set(returnValue, gestureValue)],
      [
        cond(
          eq(isDragging, true),
          cond(
            lessThan(abs(gestureValue), distanceToVote),
            [
              set(isDragging, false),
              startCardClock(clock, state, gestureValue)
            ],
            [
              cond(
                eq(hasVoted, false),
                cond(
                  lessThan(0, gestureValue),
                  [
                    set(config.toValue, throwOutDistance),
                    set(config.duration, throwOutSpeed),
                    startCardClock(clock, state, gestureValue),
                    call([], onLike),
                    set(hasVoted, true)
                  ],
                  [
                    set(config.toValue, -throwOutDistance),
                    set(config.duration, throwOutSpeed),
                    startCardClock(clock, state, gestureValue),
                    call([], onDislike),
                    set(hasVoted, true)
                  ]
                )
              )
            ]
          )
        )
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
