import dayjs from 'dayjs'

export const refreshTokenExpiresIn = () => {
  return dayjs().add(15, 'seconds').unix()
}