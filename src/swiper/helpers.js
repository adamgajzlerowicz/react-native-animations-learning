import { distanceToSkip, reactions } from './constants'

export const reaction = ({ callback, item }) => ([x, y]) => {
  if (Math.abs(y) > distanceToSkip) {
    callback([reactions.skip])
  }

  if (x > 0) {
    callback([reactions.like, item])
  }

  if (x < 0) {
    callback([reactions.dislike, item])
  }
}
