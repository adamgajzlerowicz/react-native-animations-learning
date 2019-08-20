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
  timing
} = Animated

const makeLikingValue = ({ gestureState, condition, hasVoted }) =>
  cond(
    eq(hasVoted, true),
    new Value(0),
    cond(
      and(eq(gestureState, State.ACTIVE), condition),
      [new Value(1)],
      [new Value(0)]
    )
  )

export const getIsLikingValue = ({ gestureState, dragValue, hasVoted }) =>
  makeLikingValue({
    gestureState,
    condition: greaterThan(dragValue, distanceToVote),
    hasVoted
  })

export const getIsDislikingValue = ({ gestureState, dragValue, hasVoted }) =>
  makeLikingValue({
    gestureState,
    condition: lessThan(dragValue, -distanceToVote),
    hasVoted
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
  setNextSlide,
  hasVoted,
  clockConfig,
  clockState,
  clock
}) => {
  const isDragging = new Value(false)

  return block([
    cond(
      eq(hasVoted, false),
      cond(
        eq(gestureState, State.ACTIVE),
        [set(isDragging, true), set(clockState.position, gestureValue)],
        [
          cond(
            eq(isDragging, true),
            cond(
              lessThan(abs(gestureValue), distanceToVote),
              [
                set(isDragging, false),
                set(clockConfig.toValue, 0),
                set(clockConfig.duration, returnDuration),
                startCardClock(clock, clockState, gestureValue)
              ],
              [
                set(clockConfig.duration, throwOutDuration),
                cond(
                  eq(hasVoted, false),

                  // start throw out animation and give vote
                  block([
                    cond(
                      lessThan(0, gestureValue),
                      [
                        set(clockConfig.toValue, throwOutDistance),
                        call([new Value('liked')], reaction),
                        set(hasVoted, true)
                      ],
                      [
                        set(clockConfig.toValue, -throwOutDistance),
                        call([new Value('disliked')], reaction)
                      ]
                    ),
                    startCardClock(clock, clockState, gestureValue),
                    set(hasVoted, true)
                  ])
                )
              ]
            )
          )
        ]
      )
    ),
    cond(clockRunning(clock), [
      timing(clock, clockState, clockConfig),
      cond(clockState.finished, [
        // if vote was given cleanup
        stopClock(clock),
        cond(eq(hasVoted, true), [
          call([], setNextSlide),
          set(isDragging, false),
          set(hasVoted, false),
          set(clockState.finished, 0),
          // set(clockState.position, 0),
          set(clockState.time, 0),
          set(clockState.frameTime, 0)
        ])
      ])
    ]),
    clockState.position
  ])
}
