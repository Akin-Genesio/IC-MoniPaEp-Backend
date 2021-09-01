import dayjs from 'dayjs'

export const refreshTokenExpiresIn = () => {
  return dayjs().add(30, 'minutes').unix()
}