import { distanceToSkip, reactions } from './constants'

export const reaction = ({ callback, item }) => ([x, y]) => {
  if (Math.abs(y) > distanceToSkip) {
    return callback([reactions.skip, item])
  }

  if (x > 0) {
    return callback([reactions.like, item])
  }

  if (x < 0) {
    return callback([reactions.dislike, item])
  }
}
