import { Dimensions } from 'react-native'

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

export const distanceToVote = deviceWidth / 6
export const throwOutDistance = deviceWidth
export const throwOutDuration = 300
export const returnDuration = 100
export const YSpeedMultiplier = 2
export const distanceToSkip = deviceHeight / 3
