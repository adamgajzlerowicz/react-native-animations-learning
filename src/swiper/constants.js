import { Dimensions } from 'react-native'

const deviceWidth = Dimensions.get('window').width

export const distanceToVote = deviceWidth / 6
export const throwOutDistance = deviceWidth * 2
export const throwOutSpeed = 500
export const returnSpeed = 200
